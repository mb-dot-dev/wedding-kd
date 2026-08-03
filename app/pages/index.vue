<template>
  <div>
    <header class="mt-12">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="font-tangerine text-ink text-6xl lg:text-7xl mb-2">Kata és Domi</h1>
          <h2 class="text-ink text-xl lg:text-2xl">2027. május 22.</h2>
        </div>
      </div>
    </header>

    <div class="w-full mt-8 px-4">
      <img
        src="/images/save-the-date.jpg"
        alt="Kata és Domi save the date meghívója"
        width="1000"
        height="1409"
        class="w-full max-w-md mx-auto rounded shadow-lg"
      />
    </div>

    <div class="w-full mt-8 px-4">
      <div class="max-w-2xl mx-auto flex flex-col gap-4 text-ink">
        <p>Kedves Családunk és Barátaink!🤍</p>
        <p>
          Örömmel osztjuk meg Veletek, hogy 2027. május 22-én összeházasodunk. Nagyon sok szeretettel hívunk meg
          Benneteket a templomi szertartásra, majd az azt követő vacsorára és lakodalomba.
        </p>
        <p>
          A szertartás a Zugligeti Szent Család Plébánián kerül megrendezésre, tervezetten 14:30-kor, ezt követően pedig
          együtt folytatjuk az ünneplést a templomtól csupán pár perc sétára lévő Lóvasút Kulturális és
          Rendezvényközpontban, ahol vacsorával és hajnalig tartó mulatsággal várunk mindenkit.🎉🤍
        </p>
      </div>
    </div>

    <div class="w-full mt-8">
      <div class="flex flex-col md:flex-row gap-4 justify-center text-ink">
        <div class="text-center">
          <h3 class="text-lg font-semibold">Hol?</h3>
          <div>Zugligeti Szent Család Plébánia</div>
        </div>
        <div class="text-center">
          <h3 class="text-lg font-semibold">Mikor?</h3>
          <div>2027. május 22.</div>
          <div>14:30</div>
        </div>
      </div>
    </div>

    <HighlightStrip>
      <MiddleHeading>Program</MiddleHeading>
      <div class="flex flex-col justify-center gap-4">
        <div v-for="item in program" :key="item.title" class="flex flex-col md:flex-row gap-4 justify-center">
          <span class="text-center">{{ item.time }} - {{ item.title }}</span>
        </div>
      </div>
    </HighlightStrip>
  </div>
</template>

<script lang="ts" setup>
const title = 'Köszöntő';
const description = 'Kata és Domi esküvője — 2027. május 22.';

useSeoMeta({
  title,
  description,
  ogType: 'website',
  ogUrl: 'https://kataesdomi.info',
  ogTitle: title,
  ogDescription: description,
  ogImage: 'https://kataesdomi.info/images/og.jpg',
  ogImageWidth: '1200',
  ogImageHeight: '630',
  ogLocale: 'hu_HU',
  ogSiteName: 'Kata és Domi esküvője',
});

interface ProgramItem {
  time: string;
  title: string;
}

const program: ProgramItem[] = [
  { time: '14:30', title: 'Esküvő' },
  { time: 'TODO', title: 'Vacsora' },
  { time: 'TODO', title: 'Buli' },
];
</script>
