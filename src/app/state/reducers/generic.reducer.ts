import { EntityAdapter } from "@ngrx/entity";
import { produce } from "immer";
import { Category } from "src/app/models/category.model";
import { productAdapter } from "../adapters/product.adapter";
import { GenericState, httpState } from "../app.state";

export class GenericReducer<T> {
  constructor(public adapter: EntityAdapter<T>) { }

  getInitalState() {
    return {
      data: this.adapter.getInitialState(),
      metaData: {
        removeRequestState: httpState.idle,
        addRequestState: httpState.idle,
        updateRequestState: httpState.idle,
        ListLoadRequestState: httpState.idle,
        error: null
      }
    };
  }
  onListLoadSuccess(state: GenericState<T>, { list }: any): GenericState<T> {
    return produce(state, (proxy: any) => {
      proxy.data = this.adapter.addMany(list, state.data);
      proxy.metaData.listLoadRequestState = httpState.success;
    });
  }
  onListLoadFailed(state: GenericState<T>, { err }: any): GenericState<T> {
    return produce(state, (proxy: any) => {
      proxy.listLoadRequestState = httpState.fail;
      proxy.metaData.error = err;
    })
  }
  onRemoveSuccess(state: GenericState<T>, { id }: any): GenericState<T> {
    return produce(state, (proxy: any) => {
      proxy.data = this.adapter.removeOne(id, state.data);
      proxy.metaData.removeRequestState = httpState.success
    })
  }
  onRemoveFailed(state: GenericState<T>, { err }: any): GenericState<T> {
    return produce(state, (proxy: any) => {
      proxy.removeRequestState = httpState.fail;
      proxy.metaData.error = err
    });
  }
  onAddSuccess(state: GenericState<T>, { entity }: any): GenericState<T> {
    return produce(state, (proxy: any) => {
      proxy.data = this.adapter.addOne(entity, state.data);
      proxy.metaData.addRequestState = httpState.success;
    })
  }

  onAddFailed(state: GenericState<T>, { err }) {
    return produce(state, (proxy: any) => {
      proxy.metaData.addRequestState = httpState.fail;
      proxy.metaData.error = err;
    })
  }
  onUpdateSuccess(state: GenericState<T>, { entity }) {
    return produce(state, (proxy: any) => {
      proxy.data = this.adapter.updateOne(entity, state.data);
      proxy.metaData.updateRequestState = httpState.success;
    })
  }

  onUpdateFailed(state: GenericState<T>, { err }: any) {
    return produce(state, (proxy: any) => {
      proxy.metaData.updateRequestState = httpState.fail;
      proxy.error = err;
    })
  }
  setAddRequestState(state: GenericState<T>, requestState: httpState) {
    return produce(state, (proxy: any) => {
      proxy.metaData.addRequestState = requestState;
    })
  }
  setRemoveRequestState(state: GenericState<T>, requestState: httpState) {
    return produce(state, (proxy: any) => {
      proxy.metaData.removeRequestState = requestState;
    })
  }
  setUpdateRequestState(state: GenericState<T>, requestState: httpState) {
    return produce(state, (proxy: any) => {
      proxy.metaData.updateRequestState = requestState;
    })
  }
  setListLoadRequestState(state: GenericState<T>, requestState: httpState) {
    return produce(state, (proxy: any) => {
      proxy.metaData.listLoadRequestState = requestState;
    })
  }
}

export const productReducerHandler = new GenericReducer<Category>(productAdapter);
