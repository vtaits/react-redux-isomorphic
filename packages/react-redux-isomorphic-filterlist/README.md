[![NPM](https://img.shields.io/npm/v/react-redux-isomorphic-filterlist.svg)](https://www.npmjs.com/package/react-redux-isomorphic-filterlist)
[![dependencies status](https://david-dm.org/vtaits/react-redux-isomorphic/status.svg?path=packages/react-redux-isomorphic-filterlist)](https://david-dm.org/vtaits/react-redux-isomorphic?path=packages/react-redux-isomorphic-filterlist)
[![devDependencies status](https://david-dm.org/vtaits/react-redux-isomorphic/dev-status.svg?path=packages/react-redux-isomorphic-filterlist)](https://david-dm.org/vtaits/react-redux-isomorphic?path=packages/react-redux-isomorphic-filterlist&type=dev)

# react-redux-isomorphic-filterlist

Integraion of packages [react-redux-isomorphic](https://github.com/vtaits/react-redux-isomorphic/tree/master/packages/react-redux-isomorphic) and [@vtaits/react-filterlist](https://github.com/vtaits/filterlist/tree/master/packages/react-filterlist).

List of items will be server-side rendered after first load.

## Installation

```
npm install react-redux-isomorphic @vtaits/filterlist @vtaits/react-filterlist react-redux-isomorphic-filterlist --save
```

or

```
yarn add react-redux-isomorphic @vtaits/filterlist @vtaits/react-filterlist react-redux-isomorphic-filterlist
```

## Simple example

```javascript
import { useFilterlistIsomorphic } from 'react-redux-isomorphic-filterlist';

/*
 * assuming the API returns something like this:
 *   const json = [
 *     {
 *       id: 1,
 *       brand: 'Audi',
 *       owner: 'Tom',
 *       color: 'yellow',
 *     },
 *     {
 *       id: 2,
 *       brand: 'Mercedes',
 *       owner: 'Henry',
 *       color: 'white',
 *     },
 *     {
 *       id: 3,
 *       brand: 'BMW',
 *       owner: 'Alex',
 *       color: 'black',
 *     },
 *   ]
 */

const List = () => {
  const [listState, filterlist] = useFilterlist({
    'carsList',

    loadItems: async ({
      fetch,
    }) => {
      const response = await fetch('/cars');
      const cars = await response.json();

      return {
        items: cars,
        additional: {
          count: cars.length,
        },
      };
    },
  });

  const {
    additional,
    items,
    loading,
  } = listState;

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>id</th>
            <th>brand</th>
            <th>owner</th>
            <th>color</th>
          </tr>
        </thead>

        <tbody>
          {
            items.map(({
              id,
              brand,
              owner,
              color,
            }) => (
              <tr key={ id }>
                <td>{ id }</td>
                <td>{ brand }</td>
                <td>{ owner }</td>
                <td>{ color }</td>
              </tr>
            ))
          }
        </tbody>
      </table>

      {
        additional && (
          <h4>
            Total: { additional.count }
          </h4>
        )
      }

      {
        loading && (
          <h3>Loading...</h3>
        )
      }
    </div>
  );
};
```

## Api

Api is similar with the hook of [@vtaits/react-filterlist](https://github.com/vtaits/filterlist/tree/master/packages/react-filterlist), but there are a few differences:

- First argument is id of isomorphic container, second argumnet is config of filterlist;

- First argument of `loadItems` is params of [react-redux-isomorphic](https://github.com/vtaits/react-redux-isomorphic/tree/master/packages/react-redux-isomorphic), second is current state of filterlist;

- Use unique id of isomorphic container instead of array of dependencies.
