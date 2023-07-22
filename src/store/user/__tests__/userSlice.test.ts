import {createAction} from '@reduxjs/toolkit';
import server from '../../../services/jest/server';
import {store} from '../../store';
import {getProfileAsync, getScoreMemoAsync} from '../thunks';
import {setupScoreHandlers} from '../mock-data/scoreHandlers';
import {setupUserProfileHandlers} from '../mock-data/userProfileHandlers';

describe('Redux User slice', () => {
  // given
  beforeAll(() => server.listen());
  afterAll(() => server.close());
  afterEach(() => {
    // clean up store after each test
    const resetAction = createAction('reset');
    store.dispatch(resetAction());
  });

  it('should transform the response to an object that uses user id as key and score as value', async () => {
    // given
    setupScoreHandlers();

    // when
    await store.dispatch(getScoreMemoAsync());

    // then
    const state = store.getState();
    expect(state.user.scoreMemo).toEqual({'1': 100, '2': 200});
  });

  it('when fetched user profile, there should be a default avatar url when it is undefined', async () => {
    // given
    setupUserProfileHandlers();

    // when
    await store.dispatch(getProfileAsync());

    // then
    const state = store.getState();
    expect(state.user.user.avatar_url).toEqual(
      'https://t3.ftcdn.net/jpg/02/09/37/00/360_F_209370065_JLXhrc5inEmGl52SyvSPeVB23hB6IjrR.jpg',
    );
  });
});
