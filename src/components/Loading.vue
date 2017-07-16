<template>
  <div id="loading" :class="{ready}">
    <div id="cover" class="flipLoading">
      <svg id="logo" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 160 160">
      <defs>
      
        <filter id="Rectangle" x="1" y="4" width="158" height="158" filterUnits="userSpaceOnUse">
          <feOffset dy="3" input="SourceAlpha"/>
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feFlood flood-opacity="0.161"/>
          <feComposite operator="in" in2="blur"/>
          <feComposite in="SourceGraphic"/>
        </filter>
        <clipPath id="clip">
          <rect width="160" height="160"/>
        </clipPath>
      </defs>
      <g class="cls-1">
        <rect class="cls-7" width="160" height="160"/>
        <g id="Group_349" data-name="Group 349" transform="translate(-163 -414)">
          <g v-show="!ready" class="cls-8" transform="matrix(1, 0, 0, 1, 163, 414)">
            <g class="cls-2" transform="translate(10 10)">
              <rect class="cls-5" width="140" height="140" rx="3"/>
              <rect class="cls-6" x="1.5" y="1.5" width="137" height="137" rx="1.5"/>
            </g>
          </g>
          <text id="Hacking" class="cls-3" transform="translate(243 503)"><tspan x="-54.719" y="0">Hacking</tspan></text>
          <text id="Map" class="cls-4" transform="translate(216 539)"><tspan x="0" y="0">Map</tspan></text>
        </g>
      </g>
    </svg>
    </div>
  </div>
</template>
<script>

export default {
  name: 'loading',
  props: {
    ready: Boolean
  },
  data () {
    return {
      msg: 'Welcome!'
    }
  }
}

</script>
<style lang="scss" scoped>

#loading {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0px;
  z-index: 12000;
  background-color: white;
  &.ready {
    transition: background-color 1.2s ease-in;
    background-color: rgba(0, 0, 0, 0);
  }
  &.ready * {
    transition: fill-opacity 0.8s ease-in;
    fill-opacity: 0;
  }
}


#logo{
  position: fixed;
  width: 160px;
  height: 160px;
  margin-top: -80px;
  margin-left: -80px;
  top: 50vh;
  left: 50vw;
}

@keyframes flipInY {
    0% {
        -webkit-transform: perspective(400px) rotateY(200deg);
        transform: perspective(400px) rotateY(200deg);
        opacity: 1
    }

    0%,40% {
        -webkit-animation-timing-function: ease-in;
        animation-timing-function: ease-in
    }

    40% {
        -webkit-transform: perspective(400px) rotateY(-3.2deg);
        transform: perspective(400px) rotateY(-3.2deg)
    }

    55% {
        -webkit-transform: perspective(400px) rotateY(1.6deg);
        transform: perspective(400px) rotateY(1.6deg);
        opacity: 1
    }

    70% {
        -webkit-transform: perspective(400px) rotateY(-0.8deg);
        transform: perspective(400px) rotateY(-0.8deg)
    }

    to {
        -webkit-transform: perspective(400px);
        transform: perspective(400px)
    }
}

.flipLoading {
    animation-iteration-count: infinite;
    -webkit-backface-visibility: visible!important;
    backface-visibility: visible!important;
    -webkit-animation-name: flipInY;
    animation-name: flipInY;
      
    -webkit-animation-duration: 1.3s;
    animation-duration: 1.3s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
      
}


</style>

<style>
  .cls-1 {
    clip-path: url(#clip);
  }

  .cls-2, .cls-7 {
    fill: #fff;
  }

  .cls-2 {
    stroke: #95989a;
    stroke-width: 3px;
  }

  .cls-3 {
    fill: #41a5e8;
    font-size: 34px;
  }

  .cls-3, .cls-4 {
    font-family: GillSans, Gill Sans;
  }

  .cls-4 {
    fill: #41e86e;
    font-size: 32px;
  }

  .cls-5 {
    stroke: none;
  }

  .cls-6 {
    fill: none;
  }

  .cls-8 {
    filter: url(#Rectangle);
  }
</style>
