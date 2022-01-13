import type {
  ReactElement,
} from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import sleep from 'sleep-promise';

import { Container, Button } from 'react-bootstrap';

import { useIsomorphic, LoadContextError } from 'react-redux-isomorphic';

import type {
  User,
  ErrorResponse,
} from '../types';

function UserPage(): ReactElement {
  const {
    userId,
  } = useParams();

  const {
    isReady,
    isReloading,
    context,
    error,

    reload,
  } = useIsomorphic<{
    user: User;
    date: string;
    otherUsers: User[];
  }>(`userDetail_${userId}`, async ({ fetch, setTitle, setStatus }) => {
    await sleep(1500);

    const [
      userResponse,
      otherUsersResponse,
    ] = await Promise.all([
      await fetch(`/api/users/${userId}/`),
      await fetch('/api/users/'),
    ]);

    const { status } = userResponse;
    const json = await userResponse.json();

    const otherUsersJson: User[] = await otherUsersResponse.json();

    const otherUsers = otherUsersResponse.status < 400
      ? otherUsersJson.slice(0, 5)
      : [];

    setStatus(status);

    if (status < 400) {
      const user: User = json;
      const userName = user.name || user.login;

      setTitle(`User: ${userName}`);
    } else {
      setTitle((json as ErrorResponse).message);

      throw new LoadContextError({
        status,
        json,
      });
    }

    return {
      user: json as User,
      date: String(new Date()),
      otherUsers,
    };
  });

  if (error) {
    return (
      <Container>
        <h1>User not found</h1>

        <p>
          <Link to="/">
            Back to users page
          </Link>
        </p>
      </Container>
    );
  }

  if (!isReady) {
    return (
      <Container>
        <h2>Loading...</h2>

        <p>
          <Link to="/">
            Back to users page
          </Link>
        </p>
      </Container>
    );
  }

  const {
    user,
    date,
    otherUsers,
  } = context;

  return (
    <Container>
      <h1>{user.name || user.login}</h1>

      <p>
        Loaded at:
        {' '}
        {date}
      </p>

      {
        user.name && (
          <p>
            Name:
            {' '}
            {user.name}
          </p>
        )
      }

      {
        user.score && (
          <p>
            Score:
            {' '}
            {user.score}
          </p>
        )
      }

      <p>
        <Link to="/">
          Back to users page
        </Link>
      </p>

      {
        otherUsers.length > 0 && (
          <div>
            <p>Other users:</p>

            <ul>
              {
                otherUsers.map(({ id, login }) => (
                  <li key={id}>
                    <Link to={`/${id}/`}>
                      {login}
                    </Link>
                  </li>
                ))
              }
            </ul>
          </div>
        )
      }

      <div>
        <Button
          type="button"
          disabled={isReloading}
          onClick={reload}
        >
          {isReloading ? 'Reloading...' : 'Reload'}
        </Button>
      </div>
    </Container>
  );
}

export default UserPage;
