<script lang="ts">
  import Lists from "$lib/List.svelte";
  import SideBar from "$lib/SideBar.svelte";
  import type { IList } from "$lib/interfaces";
  import { afterUpdate, onMount } from "svelte";
  let hasTask: boolean = false;
  let error = false;
  let taskName: string = "";
  let todoList: IList[] = [];



  
  onMount(() => {
    fetch("/todos", {
      method: "get",
    }).then(async (data) => {
      todoList = await data.json();
    });
  });
  async function addTask() {
    error = false;
    if (!taskName) {
      error = true;
      //alert("Please enter atleast one character");
      return;
    }
    try {
      const insertObject = { task: taskName, isCompleted: false };
      const data = await fetch("/todos", {
        method: "POST",
        body: JSON.stringify(insertObject),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await data.json();
      todoList = [...todoList, { _id: result.insertedId, ...insertObject }];
    } catch (err) {}
    taskName = "";
  }

  async function onDelete(id: string, index: number) {
    console.log(id);
    try {
      const data = await fetch("/todos", {
        method: "DELETE",
        body: JSON.stringify({ id }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      todoList.splice(index, 1);
      todoList = todoList;
    } catch (err) {}
  }

  async function onEdited(item: IList, index: number) {
    try {
      const data = await fetch("/todos", {
        method: "PUT",
        body: JSON.stringify(item),
        headers: {
          "Content-Type": "application/json",
        },
      });
      todoList[index] = item;
    } catch (err) {}
  }
  afterUpdate(() => {
    console.log("afterUpdate");
  });
</script>

<div>
  <!-- <SideBar /> -->
  <div class="main-wrapper">
    <div class="headerContainer" />
    <div class={"enterTodo " + (error ? "errorBorder" : "")}>
      <input bind:value={taskName} placeholder="Enter todo" />
      <button on:click={addTask}>ADD</button>
    </div>
    <div>
      <div>
        {#each todoList as item, index (item._id)}
          <Lists
            {item}
            on:delete={(value) => onDelete(value.detail.id, index)}
            on:edited={(value) => onEdited(value.detail, index)}
          />
        {:else}
          <h4>No items added!!</h4>
        {/each}
      </div>
    </div>
  </div>
</div>

<!-- <style>
    main {
      text-align: center;
      padding: 1em;
      flex-basis: 50%;
      margin: 0 auto;
    }
  
    h5 {
      color: #ff3e00;
      text-transform: uppercase;
      font-size: 2em;
      font-weight: 100;
      text-align: center;
    }
    .todoText {
      box-shadow: rgba(14, 30, 37, 0.12) 0px 2px 4px 0px,
        rgba(14, 30, 37, 0.32) 0px 2px 16px 0px;
      border: none;
      padding: 8px;
    }
    @media (min-width: 640px) {
      main {
        max-width: none;
      }
    }
  </style> -->

<style>
  .headerContainer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .headerBtns {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .headerContainer button {
    background: #003c5b;
    color: white;
    padding: 10px 18px;
    border: none;
    border-radius: 4px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
  }

  .headerContainer button i {
    font-size: 1.1rem;
  }

  .headerContainer button:hover {
    opacity: 0.7;
  }

  main {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
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
