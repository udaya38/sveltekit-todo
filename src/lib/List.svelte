<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { IList } from "./interfaces";
  export let item = {} as IList;
  let isEdit = true;
  const dispatch = createEventDispatcher();
  const deleteTodo = () => {
    dispatch("delete", {
      id: item._id,
    });
  };

  const editTodo = () => {
    dispatch("edited", item);
  };
</script>

<div class="todo">
  {#if isEdit}
    <h4>{item.task}</h4>
    <div class="actions">
      <i
        on:click={() => (isEdit = !isEdit)}
        class="fa-regular fa-pen-to-square"
      />
      <i
        on:click={() => {
          deleteTodo();
        }}
        class="fa-regular fa-trash-can"
      />
    </div>
  {:else}
    <div class="enterTodo edit-input">
      <input bind:value={item.task} type="text" placeholder="Enter todo" />
      <div class="actions edit-actions">
        <i
          on:click={() => {
            isEdit = !isEdit;
            editTodo();
          }}
          class="fas fa-save"
        />
        <i
          on:click={() => {
            deleteTodo();
          }}
          class="fa-regular fa-trash-can"
        />
      </div>
    </div>
  {/if}
</div>

<style>
  /* .list-container {
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
    padding: 20px;
  }

  .todoText {
    box-shadow: rgba(14, 30, 37, 0.12) 0px 2px 4px 0px,
      rgba(14, 30, 37, 0.32) 0px 2px 16px 0px;
    border: none;
    padding: 8px;
  } */
  .edit-input {
    width: 100%;
  }
  .edit-actions {
    padding: 10px;
  }
  .todo {
    border-left: 1px solid cyan;
    padding: 8px 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 14px;
    font-size: 1.3rem;
  }

  .actions i {
    cursor: pointer;
  }

  .actions i:hover {
    color: coral;
  }

  .enterTodo {
    display: flex;
    align-items: stretch;
    border: 1px solid #0891b2;
    border-radius: 5px;
    overflow: hidden;
  }

  .errorBorder {
    border-color: coral !important;
  }

  .enterTodo input {
    background: transparent;
    border: none;
    padding: 14px;
    color: white;
    flex: 1;
  }

  .enterTodo input:focus {
    outline: none;
  }

  .enterTodo button {
    padding: 0 28px;
    background: #003c5b;
    border: none;
    color: cyan;
    font-weight: 600;
    cursor: pointer;
  }

  .enterTodo button:hover {
    background: transparent;
  }
</style>
