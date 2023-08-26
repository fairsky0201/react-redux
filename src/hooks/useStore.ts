import type { Context } from 'react'
import type { Action as BasicAction, UnknownAction, Store } from 'redux'
import type { ReactReduxContextValue } from '../components/Context'
import { ReactReduxContext } from '../components/Context'
import {
  useReduxContext as useDefaultReduxContext,
  createReduxContextHook,
} from './useReduxContext'

/**
 * Hook factory, which creates a `useStore` hook bound to a given context.
 *
 * @param {React.Context} [context=ReactReduxContext] Context passed to your `<Provider>`.
 * @returns {Function} A `useStore` hook bound to the specified context.
 */
export function createStoreHook<
  S = unknown,
  A extends BasicAction = UnknownAction
  // @ts-ignore
>(context?: Context<ReactReduxContextValue<S, A> | null> = ReactReduxContext) {
  const useReduxContext =
    // @ts-ignore
    context === ReactReduxContext
      ? useDefaultReduxContext
      : // @ts-ignore
        createReduxContextHook(context)
  return function useStore<
    State = S,
    Action2 extends BasicAction = A
    // @ts-ignore
  >() {
    const { store } = useReduxContext()
    // @ts-ignore
    return store as Store<State, Action2>
  }
}

/**
 * A hook to access the redux store.
 *
 * @returns {any} the redux store
 *
 * @example
 *
 * import React from 'react'
 * import { useStore } from 'react-redux'
 *
 * export const ExampleComponent = () => {
 *   const store = useStore()
 *   return <div>{store.getState()}</div>
 * }
 */
export const useStore = /*#__PURE__*/ createStoreHook()
