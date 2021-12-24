<template>
  <view :style="[customStyle]">
    <dz-image
      v-if="cover != ''"
      :src="cover"
	  :width="width"
	  :height="height"
    ></dz-image>
  </view>
</template>

<script>
  name: 'dz-position'
  export default {
    props: {
      mode: {
        type: String,
        default: 'image',
      },
      // 背景颜色
      bgColor: {
        type: String,
        default: '#A3A3A3',
      },
      cover: {
        type: String,
        default: '',
      },
      width: {
        type: [Number, String],
        default: 0,
      },
      height: {
        type: [Number, String],
        default: 0,
      },
      top: {
        type: [Number, String],
        default: 0,
      },
      left: {
        type: [Number, String],
        default: 0,
      },
    },
    computed: {
      // 边框自定义样式
      customStyle() {
        let style = {
          width: this.width + 'rpx',
          height: this.height + 'rpx',
          'border-radius': `${this.height / 2}rpx`,
          background: !this.cover ? this.bgColor : '',
          overflow: 'hidden',
          // position: 'absolute',
          // zIndex: '999',
          // top: this.top + 18 + 'px',
          // left: this.left + 'px',
        }
        return style
      },
    },
    mounted() {},
  }
</script>

