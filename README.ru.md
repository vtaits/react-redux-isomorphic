# react-redux-isomorphic

Набор компонентов и утилит для создания изоморфных приложений с использованием react и redux.

## Задачи

При написании изоморфного приложения могут возникнуть следующие проблемы:

1. Инкапсуляция логики загрузки данных. Например, браузер может использовать fetch, axios, jQuery.ajax и т. д., а сервер - request, node-fetch, или взять данные из базы данных, redis и т. д. Компонент не должен ничего знать о среде исполнения.
2. Ожидание окончательной загрузки данных для всех компонентов на сервере перед отправкой html на клиент. Если просто вызвать ReactDOMServer.renderToString и отправить полученный html, то браузер получит страницу с предлоадером, и смысл рендеринга на сервере теряется.
3. При первом рендере клиент не должен запрашивать данные, а использовать то, что пришло с сервера. Но если пользователь попал на страницу с другой страницы сайта, используя, например, react-router, нужно сделать запрос с клиента.
4. Http-статусы, тайтл страницы и метатеги при серверном рендере. Например, есть роут `/users/:userId/`, но запрашиваемого пользователя не существует. Тогда нужно отдать на клиент страницу со статусом 404, но определить, что это требуется, можно только после выполнения асинхронного запроса в компоненте.

## Решение задач

Сначала нужно всё реакт-дерево обернуть в `IsomorphicProvider`, в `loadParams` установить все параметры, которые отличаются в разных средах исполнения.

Например, клиент использует `fetch` (и полифилл `whatwg-fetch`), а сервер - `node-fetch`. Тогда код будет выглядеть так:

```
// server.jsx

import fetch from 'node-fetch';
import { IsomorphicProvider } from 'react-redux-isomorphic';

import AmazingReactApp from './shared/app';

...

const componentForRender = (
  <IsomorphicProvider
    loadParams={{
      fetch,
    }}
  >
    <AmazingReactApp />
  </IsomorphicProvider>
);
```

```
// client.jsx

import 'whatwg-fetch';
import { IsomorphicProvider } from 'react-redux-isomorphic';

import AmazingReactApp from './shared/app';

...

const componentForRender = (
  <IsomorphicProvider
    loadParams={{
      fetch,
    }}
  >
    <AmazingReactApp />
  </IsomorphicProvider>
);
```

Далее, компонент, который ожидает загрузки данных нужно оберуть декоратором:

```
// component.jsx

import React, { Component } from 'react';
import { isomorphic } from 'react-redux-isomorphic';

class AmazingComponent extends Component {
  static propTypes = {
    isomorphic: PropTypes.shape({
      isReady: PropTypes.bool.isRequired,
      isLoading: PropTypes.bool.isRequired,
      context: PropTypes.any,
      error: PropTypes.any,
    }),

    // ... propTypes for other props
  }

  ...
}

export default isomorphic({
  isomorphicId: 'amazing',

  getContext: async ({ fetch }) => {
    const response = await fetch(amazingUrl);

    return await response.json();
  },
})(AmazingComponent);
```

Как видно из описания `propTypes`, компоент получит ещё один prop. Его описание в разделе api.

Функция `getContext` будет вызвана один раз при первом рендере компонента. Если компонент отрендерен сервером, она не будет вызвана, а будут использованы существующие данные.

Исходя из названия библиотеки, для хранения и синхронизации данных она использует `redux`. Нужно обязательно добавить её редьюсер в `store` приложения.

```
// reducers.js

import { combineReducers } from 'redux';

import { reducer as reactReduxIsomorphic } from 'react-redux-isomorphic';

...

export default combineReducers({
  reactReduxIsomorphic,
  // ... other reducers
});
```

Теперь нужно дождаться завершения всех асинхронных запросов из компонентов на сервере перед отправкой html на клиент. Для этого можно использовать функцию `waitAndRender`.

```
// server.jsx

import fetch from 'node-fetch';
import Provider from 'react-redux;
import { IsomorphicProvider, waitAndRender } from 'react-redux-isomorphic';

import express from 'express';

import AmazingReactApp from './shared/app';
import reducers from './shared/reducers';
import createStore from './server/createStore';

const app = express();

...

function renderHTML(reactMarkup, initialState) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Amazing react app</title>
<body>
<div id="app">${reactMarkup}</div>
<script>
window.__PRELOADED_STATE__ = ${JSON.stringify(initialState).replace(/</g, '\\u003c')};
</script>
<script src="/dist/bundle.js"></script>
</body>
</html>`;
}

app.get('*', async (req, res) => {
  const store = createStore(reducers);

  const componentForRender = (
    <Provider store={store}>
      <IsomorphicProvider
        loadParams={{
          fetch,
        }}
      >
        <AmazingReactApp />
      </IsomorphicProvider>
    </Provider>
  );

  const reactMarkup = await waitAndRender(() => renderToString(componentForRender), store);

  const html = renderHTML(reactMarkup, store.getState());

  res.send(html);
});

export default app;
```

И принять состояние redux на клиенте.

```
// client.jsx

import 'whatwg-fetch';
import { IsomorphicProvider } from 'react-redux-isomorphic';
import { Provider } from 'react-redux';

import AmazingReactApp from './shared/app';
import reducers from './shared/reducers';
import createStore from './client/createStore';

...

const store = createStore(reducers, window.__PRELOADED_STATE__);

const componentForRender = (
  <Provider store={store}>
    <IsomorphicProvider
      loadParams={{
        fetch,
      }}
    >
      <AmazingReactApp />
    </IsomorphicProvider>
  </Provider>
);
```

Приложение работает. Осталось только сделать возможность изменять title страницы, а также решить вопрос с http-статусами при серверном рендере. Для этого нужно добавить ещё две функции в `loadParams`. Назовём их `setTitle` и `setStatus`.

```
// server.jsx

import fetch from 'node-fetch';
import Provider from 'react-redux';
import { IsomorphicProvider, waitAndRender } from 'react-redux-isomorphic';

import express from 'express';

import AmazingReactApp from './shared/app';
import reducers from './shared/reducers';
import createStore from './server/createStore';

const app = express();

...

function renderHTML(reactMarkup, title, initialState) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
<body>
<div id="app">${reactMarkup}</div>
<script>
window.__PRELOADED_STATE__ = ${JSON.stringify(initialState).replace(/</g, '\\u003c')};
</script>
<script src="/dist/bundle.js"></script>
</body>
</html>`;
}

app.get('*', async (req, res) => {
  let title = 'Amazing react app';
  let status = 200;
  const store = createStore(reducers);

  const componentForRender = (
    <Provider store={store}>
      <IsomorphicProvider
        loadParams={{
          setTitle: (titleForSet) => {
            title = titleForSet;
          },
          setStatus: (statusForSet) => {
            status = statusForSet;
          },
          fetch,
        }}
      >
        <AmazingReactApp />
      </IsomorphicProvider>
    </Provider>
  );

  const reactMarkup = await waitAndRender(() => renderToString(componentForRender), store);

  const html = renderHTML(reactMarkup, store.getState());

  res.status(status).send(html);
});

export default app;
```

И на клиенте.

```
// client.jsx

import 'whatwg-fetch';
import { IsomorphicProvider } from 'react-redux-isomorphic';
import { Provider } from 'react-redux';

import AmazingReactApp from './shared/app';
import reducers from './shared/reducers';
import createStore from './client/createStore';

...

const store = createStore(reducers, window.__PRELOADED_STATE__);

const componentForRender = (
  <Provider store={store}>
    <IsomorphicProvider
      loadParams={{
        setTitle: (titleForSet) => {
          document.title = titleForSet;
        },
        setStatus: () => {},
        fetch,
      }}
    >
      <AmazingReactApp />
    </IsomorphicProvider>
  </Provider>
);
```

Теперь компонент может использовать эти функции

```
// component.jsx

import { isomorphic, LoadContextError } from 'react-redux-isomorphic';

...

export default isomorphic({
  isomorphicId: 'amazing',

  getContext: async ({ fetch, setStatus, setTitle }) => {
    const response = await fetch(amazingUrl);
    const status = response.status;
    
    const responseJSON = await response.json();

    setStatus(status);

    if (status < 400) {
      setTitle(responseJSON.title);

      return responseJSON;
    }

    switch(status) {
      case 403:
        setTitle('Not found');
        break;

      case 404:
        setTitle('Access denied');
        break;

      default:
        setTitle('Error');
        break;
    }

    throw new LoadContextError(responseJSON);
  },
})(AmazingComponent);
```

Готово.

## Api

### reducer

```
import { reducer } from 'react-redux-isomorphic';
```

Редьюсер, который хранит состояние изоморфных компонентов. Должен монтироваться по ключу `reactReduxIsomorphic` в сторе.

### IsomorphicProvider

Провайдер, который предоставляет параметры для функции `getContext` для инкапсуляции логики загрузки данных на сервере и клиенте. Объект, переданный в prop `loadParams`, будет первым аргументом при вызове функции `getContext` декоратора.

### isomorphic

```
import { isomorphic } from 'react-redux-isomorphic';

class AmazingComponent extends Component {
  static propTypes = {
    isomorphic: PropTypes.shape({
      isReady: PropTypes.bool.isRequired,
      isLoading: PropTypes.bool.isRequired,
      context: PropTypes.any,
      error: PropTypes.any,
    }),

    // ... propTypes for other props
  }

  ...
}

export default isomorphic({
  isomorphicId: 'isomorphicId',

  getContext: async (loadParams, componentProps) => {
    ...
  },

  shouldReload: (newProps, oldProps) => {
    ...
  },
})(AmazingComponent);
```

Декоратор, который оборачивает компонент и загружает данные для него. Параметры:

- *isomorphicId* - id изоморфного компонента, должен быть уникальным. Должен быть передан параметром декоратора или через props компонента.
- *getContext* - асинхронная функция загрузки данных для компонента. Принимает два аргумента: `loadParams` провайдера и props компонента.
- *shouldReload* - необязательное, функция проверки, требуется ли обновление данных для компонента. Например, произошла смена страницы, но компонент, отвечающий за отрисовку страницы, изменён не был. Принимает два аргумента: новые и старые props компонента соответственно.

Добавляет компоненту prop `isomorphic`, который является объектом, состоящим из параметров:
- *isReady* (boolean) - загружены ли данные для компонента;
- *isLoading* (boolean) - находится ли компонент в состоянии загрузки;
- *context* (any) - результат успешного выполнения функции `getContext`;
- *error* (any) - результат выполнения функции `getContext` с ошибкой `LoadContextError`.

### LoadContextError

Ошибка загрузки данных для компонента.

```
import { LoadContextError } from 'react-redux-isomorphic';

...

throw new LoadContextError(error);
```

### isomorphicPropTypes

```
import { isomorphicPropTypes } from 'react-redux-isomorphic';
```

Функция для облегчения описания propTypes декорированного компонента.

```
class AmazingComponent extends Component {
  static propTypes = {
    isomorphic: isomorphicPropTypes({
      context: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }),
      error: PropTypes.shape({
        status: PropTypes.number.isRequired,
        message: PropTypes.string.isRequired,
      }),
    }),

    // ... propTypes for other props
  }

  ...
}
```

Принимает объект со свойствами:

- *context* - описание результата успешного выполнения `getContext`;
- *error* - описание результата выполнения `getContext` с ошибкой.

## waitAndRender

```
import { waitAndRender } from 'react-redux-isomorphic';
```

Асинхронная функция для ожидания выполнения всех `getContext` компонентов. Принимает аргументы:

1. Функция рендера дерева `react`;
2. `store`, в котором есть `reactReduxIsomorphic`.

```
await waitAndRender(store);
```

## Injector

```
import { Injector } from 'react-redux-isomorphic';
```

Компонент для предоставления `loadParams`, переданного в `IsomorphicProvider`, другим компонентам.

```
<Injector>
  {(loadParams) => (
    <AmazingComponent
      amazingProp="amazingValue"
      loadParams={loadParams}
    />
  )}
</Injector>
```

## inject

```
import { inject } from 'react-redux-isomorphic';
```

Компонент высшего порядка, добавляющий оригинальному компоненту prop `loadParams`, который был передан в `IsomorphicProvider`.

```
const WithLoadParams = inject(AmazingComponent);
```

## useIsomorphic

Альтернатива `isomorphic`.

```
import { useIsomorphic } from 'react-redux-isomorphic';

const AmazingComponent = () => {
  const {
    isReady,
    isLoading,
    context,
    error,

    reload,
  } = useIsomorphic('isomorphicId', async (loadParams) => {
    ...
  });

  ...
};
```

**Важно**

При использовании на сервере обязательно компоненту `IsomorphicProvider` нужно добавить `isFakeHooks={true}`

```
<IsomorphicProvider
  loadParams={loadParams}
  isFakeHooks
>
  ...
</IsomorphicProvider>
```

## useLoadParams

```
import { useLoadParams } from 'react-redux-isomorphic';
```

Хук для получения `loadParams`.

```
const AmazingComponent = () => {
  const loadParams = useLoadParams();

  ...
};
```

## typescript

Пример глобальной типизации параметров загрузки:

```
import 'react-redux-isomorphic';

type MyLoadParams = {
  // Определить параметры загрузки здесь
};

declare module 'react-redux-isomorphic' {
  export interface DefaultLoadParams extends MyLoadParams {
  }
}
```
