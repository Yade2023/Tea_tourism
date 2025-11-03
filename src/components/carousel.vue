<template>
  <div>
    <div ref="emblaRef" class="embla">
      <div class="embla__container">
        <div class="embla__slide">Slide 1</div>
        <div class="embla__slide">Slide 2</div>
        <div class="embla__slide">Slide 3</div>
        <div class="embla__slide">Slide 4</div>
        <div class="embla__slide">Slide 5</div>
        <div class="embla__slide">Slide 6</div>
        <div class="embla__slide">Slide 7</div>
      </div>
    </div>
    <button @click="scrollPrev">Prev</button>
    <button @click="scrollNext">Next</button>
  </div>
</template>


<script>
import EmblaCarousel from 'embla-carousel'

export default {
  name: 'EmblaCarousel',
  data() {
    return {
      emblaApi: null,
    }
  },
  computed: {
    colors() {
      return Array.from({ length: 20 }, (_, i) => {
        const hue = (i * 137.508) % 360;
        return `hsl(${hue}, 80%, 80%)`;
      });
    }
  },
  mounted() {
    const emblaRef = this.$refs.emblaRef
    const options = { skipSnaps: true }

    this.emblaApi = EmblaCarousel(emblaRef, options)
  },
  methods: {
    scrollPrev() {
      this.emblaApi?.scrollPrev()
    },
    scrollNext() {
      this.emblaApi?.scrollNext()
    }
  }
}
</script>

<style scoped>
.embla {
  overflow: hidden;
}

.embla__container {
  display: flex;
}

.embla__slide {
  flex: 0 0 25%;
  min-width: 0;
}
</style>
