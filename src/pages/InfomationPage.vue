<template>
  <q-page class="">
    <div class="text-h5 q-pb-md">共有URLまとめ</div>
    <!--Links-->
    <div id="info-links" class="q-pb-md">
      <div id="notion-urls">
        <a
          class="row q-gutter-xs info-link-row"
          href="https://brindle-spring-0d6.notion.site/URL-2998ca28318d430cbdd7d5b7ad034ccf?pvs=4"
          target="_blank"
          rel="noopener"
        >
          <div>
            <img src="../assets/notion_icon.png" class="info-icon" />
          </div>
          <div class="text-subtitle1">Notion</div>
        </a>
      </div>
      <div id="google-urls" class="q-pt-sm">
        <a
          class="row q-gutter-xs info-link-row"
          href="https://drive.google.com/drive/folders/1XSRGqBx5FeJaOSJj9UtF3e2M7S3Z3PsG?usp=sharing"
          target="_blank"
          rel="noopener"
        >
          <div>
            <img src="../assets/google_drive_icon.png" class="info-icon" />
          </div>
          <div class="text-subtitle1">Googleドライブ</div>
        </a>
      </div>
    </div>
  </q-page>
</template>
<style>
/*image */
.info-icon {
  height: 30px;
}
/*link a tag */
.info-link-row {
  transition: color 0.3s;
  text-decoration: none;
}

.info-link-row:hover {
  text-decoration: underline;
}
</style>
