<script lang="ts">
  import Task from "$lib/Task.svelte";
  import TaskFiles from "$lib/TaskFiles.svelte";
  import TaskImages from "$lib/TaskImages.svelte";
  let isActiveTab = Task;
</script>

<main class="main-container">
  <div class="main-wrapper">
    <footer>
      <div class="navigator">
        <button
          class:btn-active={isActiveTab === Task}
          on:click={() => (isActiveTab = Task)}>Tasks</button
        >
        <button
          class:btn-active={isActiveTab === TaskFiles}
          on:click={() => (isActiveTab = TaskFiles)}>Files</button
        >
      </div>
    </footer>
    <svelte:component this={isActiveTab} />
  </div>
</main>

<style>
  .main-container {
    min-height: 100vh;
    background: linear-gradient(to right, #000428, #000046);
    color: white;
    position: relative;
    display: flex;
    flex-direction: column;
  }
  .main-wrapper {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 24px;
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
  }
  .navigator {
    display: flex;
  }

  button {
    padding: 0 28px;
    background: #003c5b;
    border: none;
    color: cyan;
    font-weight: 600;
    cursor: pointer;
    width: 100%;
    border: 1px solid #0891b2;
  }

  .btn-active {
    background-color: #16628a;
  }
</style>
