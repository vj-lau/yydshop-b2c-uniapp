<template>
  <view>
    <dz-navbar title="申请历史"></dz-navbar>
    <view>
      <dz-empty v-if="applyInfo.length==0 && !isShow" text="暂无申请记录" :src="empty" iconSize="360"></dz-empty>
      <view class="card" v-for="(item,i) in applyInfo" :key='i'>
        <view v-if="item.level==1">申请等级：
          <dz-tag :text="item.level | regionalAgentLevelFilter" bg-color=" #fdc561" mode="dark" size="mini"/>
        </view>
        <view v-if="item.level==2">申请等级：
          <dz-tag :text="item.level | regionalAgentLevelFilter" bg-color=" #42e38d" mode="dark" size="mini"/>
        </view>
        <view v-if="item.level==3">申请等级：
          <dz-tag :text="item.level | regionalAgentLevelFilter" bg-color=" #2eafff" mode="dark" size="mini"/>
        </view>
        <view style="margin-top: 4rpx;">申请区域：{{item.address_name}}</view>
        <view style="margin-top: 4rpx;">申请时间：{{item.created_at | timeFormat }}</view>
        <view style="margin-top: 4rpx;display: flex;
     flex-direction: row;
     align-items: center;margin-right: 4rpx;" class="status">
          <view>结果： </view>
          <view class="dzicon-iconfont dzicon-round_rank_fill" v-if="parseInt(item.state) == 0"></view>
          <view class="dzicon-iconfont dzicon-infofill" v-if="parseInt(item.state) == -1"></view>
          <view class="dzicon-iconfont dzicon-roundcheckfill" v-if="parseInt(item.state) == 1"></view>
          <view class="dz-m-l-6">{{ item.state | stateFilters }}</view>
        </view>
      </view>
    </view>
    <dz-page-loading :show="loadingShow" :status="loadingStatus" @click="loadingClick"></dz-page-loading>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        theme: this.$api.theme,
        language: this.$api.language,
        empty: this.$api.assetsConfig.empty,
        manageType: [{
            value: '3',
            name: '区代'
          },
          {
            value: '2',
            name: '市代'
          },
          {
            value: '1',
            name: '省代'
          }
        ],
        checked: false,
        showPicker: false,
        regional_level: 3,
        mobile: '',
        address_details: '',
        address: this.$api.language.address.pleaseChoose,
        addressData: {
          province_id: 0,
          city_id: 0,
          area_id: 0
        },
        addressParams: {
          province: true,
          city: true,
          area: true
        },
        isShow: false,
        applyInfo: [],
        promoterInfo: {},
        regionalConfig: {},
        btnDisabled: false,
        loadingShow: true,
        loadingStatus: 'loading',
        current: 1,
        // 负责的区域
        territory: []
      };
    },
    async onLoad() {
      uni.setNavigationBarTitle({
        title: '申请区域代理'
      });
      await this.$onLaunched;
      this.getPromoterInfo();
    },
    filters: {
      regionalAgentLevelFilter(val) {
        switch (parseInt(val)) {
          case 1:
            return '省代';
          case 2:
            return '市代';
          case 3:
            return '区代';
        }
      },
      stateFilters(val) {
        switch (parseInt(val)) {
          case 0:
            return '待审核';
          case -1:
            return '拒绝';
          case 1:
            return '已通过';
        }
      }
    },
    methods: {
      async getPromoterInfo() {
        await this.$api.http
          .get(this.$api.apiDistribution.memberIndex)
          .then(async res => {
            console.log(res, 1);
            this.promoterInfo = res.data.promoter || {};
            await this.getRegionalLevelConfig();
            await this.getRegionalAgentApplySchedule();
            this.loadingShow = false;
          })
          .catch(err => {
            console.log(err);
            this.loadingStatus = 'error';
          });
      },
      async getRegionalLevelConfig() {
        await this.$api.http.get(this.$api.apiDistribution.regionalLevelConfig).then(res => {
          this.regionalConfig = res.data;
        });
      },
      async getRegionalAgentApplySchedule() {
        await this.$api.http.get(this.$api.apiDistribution.regionalAgentApplySchedule).then(res => {
          console.log(res, 3);
          this.applyInfo = res.data
          this.territory = []
          res.data.forEach((item) => {
            if (item.state == 1) {
              this.territory.push(item)
            }
          })
          if (!this.applyInfo) {
            this.isShow = true;
          }
        });
      },
      toApply() {
        this.isShow = !this.isShow;
      },
      loadingClick() {
        this.getPromoterInfo();
      },
      // 监听反馈类型事件
      groupChange(e) {
        this.regional_level = e.value;
        let level = parseInt(this.regional_level);
        if (level === 3) {
          this.addressParams.province = true;
          this.addressParams.city = true;
          this.addressParams.area = true;
        } else if (level === 2) {
          this.addressParams.province = true;
          this.addressParams.city = true;
          this.addressParams.area = false;
        } else if (level === 1) {
          this.addressParams.province = true;
          this.addressParams.city = false;
          this.addressParams.area = false;
        }
        this.address = this.$api.language.address.pleaseChoose;
        this.addressData.province_id = 0;
        this.addressData.city_id = 0;
        this.addressData.area_id = 0;
      },
      application() {
        this.$api.router.push({
          route: this.$api.routesConfig.distributionApplyAgncy,
        });
      }
    },

  };
</script>

<style lang="scss" scoped>
  .card {
    background-color: #fff;
    border-radius: 20rpx;
    margin: 20rpx;
    padding: 20rpx;
  }

  .dzicon-round_rank_fill {
    color: $dz-type-warning-disabled;
  }

  .dzicon-roundcheckfill {
    color: $dz-type-success;
  }

  .dzicon-infofill {
    color: $dz-type-error;
  }
</style>
