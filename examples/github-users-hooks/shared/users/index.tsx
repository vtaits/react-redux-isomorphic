import type {
  ChangeEventHandler,
  FC,
} from 'react';
import {
  useCallback,
} from 'react';

import { Link } from 'react-router-dom';

import { Container, Table } from 'react-bootstrap';

import {
  useFilterlistIsomorphic,
  LoadListError,
} from 'react-redux-isomorphic-filterlist';

import type {
  LoadParams,
  User,
  ErrorResponse,
} from '../types';

const UsersPage: FC = () => {
  const [
    listState,
    filterlist,
  ] = useFilterlistIsomorphic(
    'usersPage',

    {
      loadItems: async (
        {
          fetch,
          setTitle,
        }: LoadParams,
        {
          appliedFilters,
        },
      ) => {
        const usersResponse = await fetch('/api/users/');

        const { status } = usersResponse;
        const json = await usersResponse.json();
    
        if (status < 400) {
          setTitle('Github users');
        } else {
          setTitle((json as ErrorResponse).message);
    
          throw new LoadListError({
            error: {
              status,
              json,
            },
          });
        }

        const loginFilter = appliedFilters.login as string;

        const filteredItems = loginFilter
          ? (json as User[]).filter(({ login }) => login.includes(loginFilter))
          : json as User[];

        return {
          items: filteredItems,
        };
      },
    },
  );

  const onSearchLoginChange = useCallback<ChangeEventHandler<HTMLInputElement>>((e) => {
    filterlist.setAndApplyFilter('login', e.target.value);
  }, [filterlist]);

  const {
    items,
    appliedFilters,
    loading,
    error,
  } = listState;

  if (error) {
    return (
      <Container>
        <h1>Error loading data</h1>
      </Container>
    );
  }

  return (
    <Container>
      <h1>Github users</h1>

      <Table>
        <thead>
          <tr>
            <th>
              Login
            </th>

            <th>
              Score
            </th>
          </tr>

          <tr>
            <th>
              <input
                type="text"
                value={appliedFilters.login as string || ''}
                onChange={onSearchLoginChange}
              />
            </th>

            <th />
          </tr>
        </thead>

        <tbody>
          {
            items.map(({ id, login, score }) => (
              <tr key={id}>
                <td>
                  <Link to={`/${id}/`}>
                    {login}
                  </Link>
                </td>

                <td>
                  {score}
                </td>
              </tr>
            ))
          }
        </tbody>
      </Table>

      {
        loading && (
          <h2>Loading ...</h2>
        )
      }
    </Container>
  );
};

export default UsersPage;
