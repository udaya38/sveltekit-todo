<script lang="ts">
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  import type { IFile } from "./interfaces";
  let isLoaded: boolean = false;
  let fileData = {} as IFile;
  let progressValue = 0;
  let isProgressStart: boolean = false;
  let fileList: any = [];
  let showFiles: boolean = false;
  let resetFile: any = "";
  onMount(() => {
    fetch("/files", {
      method: "get",
    }).then(async (data) => {
      fileList = await data.json();
      showFiles = true;
    });
  });

  const onchange = (event: Event) => {
    progressValue = 0;
    isProgressStart = false;
    const target = event.target as HTMLInputElement;
    resetFile = target;
    const file: File = (target.files as FileList)[0];
    console.log(file);
    fileData.size = file.size;
    fileData.name = file.name;
    fileData.type = file.type;
    if (file.size > 1048576) {
      window.alert("File size should be less than 1 mb");
      target.value = "";
      return;
    }
    isProgressStart = true;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      console.log(reader.result);
      fileData.url = reader.result;
      isLoaded = true;
    };
    reader.onprogress = (event) => {
      console.log(event);
      progressValue = Math.floor(event.loaded / event.total) * 100;
    };
  };

  const uploadFile = async () => {
    try {
      const data = await fetch("/files", {
        method: "POST",
        body: JSON.stringify(fileData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await data.json();
      //console.log(result);
      fileList = [
        ...fileList,
        { ...fileData, _id: result.fileDetailsId, fileId: result.filesId },
      ];
      resetFile.value = "";
      isProgressStart = false;
    } catch (error) {}
  };

  const showFile = async (file: any) => {
    const data = await fetch(`/files/${file.fileId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await data.json();
    const base64 = result.url.split(",")[1];
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: file.type });
    const blobUrl = URL.createObjectURL(blob);
    const element = document.createElement("a");
    element.href = blobUrl;
    element.download = file.name;
    element.click();
    URL.revokeObjectURL(blobUrl);
    //window.open(blobUrl, "_blank");
  };

  async function deleteFile(file: any, index: number) {
    //console.log(id);
    try {
      const data = await fetch("/files", {
        method: "DELETE",
        body: JSON.stringify({ id: file._id, fileId: file.fileId }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      fileList.splice(index, 1);
      fileList = fileList;
    } catch (err) {}
  }
</script>

<div>
  <h2>Files</h2>
  <div class="mb-3">
    <label for="formFile" class="form-label"></label>
    <input
      class="form-control upload-file"
      type="file"
      id="formFile"
      on:change={(event) => onchange(event)}
    />
  </div>
  {#if isProgressStart}
    <div
      class="progress"
      role="progressbar"
      aria-label="Example with label"
      aria-valuenow="25"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div class="progress-bar" style="width: {progressValue}%">
        {progressValue}%
      </div>
    </div>
    <div class="submit-btn">
      <button
        type="button"
        class="btn btn-primary"
        disabled={!isLoaded}
        on:click={uploadFile}>Submit</button
      >
    </div>
  {/if}
  {#if showFiles}
    <div class="container">
      <div class="row justify-content-between">
        {#each fileList as file, index}
          <div class="col-sm-5 individual-file">
            <div class="file-icons">
              <i
                class="fa fa-download"
                aria-hidden="true"
                on:click={() => showFile(file)}
              />
              <i
                class="fa fa-trash"
                aria-hidden="true"
                on:click={() => deleteFile(file, index)}
              />
            </div>
            <div>{file.name}</div>
            <!-- <img src={file.url} alt={file.name} /> -->
          </div>
        {:else}
          <h3>
            File list is empty <i
              class="fa fa-exclamation"
              aria-hidden="true"
            />
          </h3>
        {/each}
      </div>
    </div>
  {:else}
    <p class="loader">Loading...</p>
  {/if}
</div>

<style>
  .loader {
    font-weight: bold;
    color: cyan;
    font-size: 2rem;
  }
  .upload-file {
    color: cyan;
    background: #003c5b;
    border: 1px solid #0891b2;
  }
  .btn-primary,
  .btn-primary:active {
    color: cyan;
    background: #003c5b;
    border: 1px solid #0891b2;
  }
  .progress-bar {
    background-color: cyan;
    font-weight: bolder;
    color: #003c5b;
  }
  .submit-btn {
    margin-top: 10px;
  }
  i {
    cursor: pointer;
    font-size: 1.1rem;
  }
  .individual-file {
    margin: 10px;
    padding: 10px;
    border: 2px solid cyan;
    border-radius: 10px;
  }
  .file-icons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    align-items: center;
  }
  img {
    width: 100%;
    height: 200px;
  }
</style>
