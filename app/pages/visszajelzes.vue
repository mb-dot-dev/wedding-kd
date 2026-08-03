<template>
  <div>
    <header class="w-full text-center">
      <PageHeading>Visszajelzés</PageHeading>
    </header>

    <div class="w-full mt-5 px-4">
      <div class="max-w-2xl mx-auto flex flex-col justify-center gap-4 text-ink">
        <div class="text-center">
          Nagyon örülünk, hogy tudtok velünk ünnepelni! <br />
          Légyszi jelezzetek vissza ezen a linken TODO: határidő-ig.
        </div>
        <div class="text-center">
          <!-- TODO: <GoogleFormsButton class="flex justify-center" link="..." /> once the form URL exists -->
          TODO: google forms link
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const title = 'Visszajelzés';
const description = 'Részvételi visszajelzés küldése Kata és Domi esküvőjére';

useSeoMeta({
  title,
  description,
  ogType: 'website',
  ogUrl: 'https://kataesdomi.info/visszajelzes',
  ogTitle: title,
  ogDescription: description,
  ogImage: 'https://kataesdomi.info/images/og.jpg',
  ogImageWidth: '1200',
  ogImageHeight: '630',
  ogLocale: 'hu_HU',
  ogSiteName: 'Kata és Domi esküvője',
});
</script>
