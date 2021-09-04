type SyncHandler<T> = (data: T) => void
type AsyncHandler<T> = (data: T) => Promise<void>
type Handler<T> = SyncHandler<T> | AsyncHandler<T>
type ResponseHandler<T> = Handler<T> | void
type Subscriptor<T> = (subscriber: SyncHandler<T>) => void

type Peer<I, O = I> = {
  publish: Handler<I>
  subscribe: Subscriptor<O>
}

export type {Peer, AsyncHandler, SyncHandler, Subscriptor, Handler, ResponseHandler}