<template>
  <div>
    <a-card :loading="loading" :bordered="false" :body-style="{ padding: '0' }">
      <div class="salesCard">
        <a-tabs default-active-key="1" size="large"
                :tab-bar-style="{ marginBottom: '24px', paddingLeft: '16px' }">
          <!-- <div class="extra-wrapper" slot="tabBarExtraContent">
            <div class="extra-item">
              <a>{{ $t('dashboard.analysis.all-day') }}</a>
              <a>{{ $t('dashboard.analysis.all-week') }}</a>
              <a>{{ $t('dashboard.analysis.all-month') }}</a>
              <a>{{ $t('dashboard.analysis.all-year') }}</a>
            </div>
            <a-range-picker :style="{ width: '256px' }" />
          </div> -->
          <a-tab-pane loading="true" tab="出库任务数" key="1">
            <a-row>
              <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                <bar :data="barData" title="出库任务柱状图" />
              </a-col>
              <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <rank-list title="出库物料排名" :list="rankList" />
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane tab="入库任务数" key="2">
            <a-row>
              <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                <bar :data="barData2" title="入库任务柱状图" />
              </a-col>
              <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <rank-list title="入库物料排名" :list="rankList2" />
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>

    <div class="antd-pro-pages-dashboard-analysis-twoColLayout" :class="!isMobile && 'desktop'">
      <a-row :gutter="24" type="flex" :style="{ marginTop: '24px' }">
        <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card :loading="loading" :bordered="false" title="物料库存排行榜" :style="{ height: '100%' }">
            <a-dropdown :trigger="['click']" placement="bottomLeft" slot="extra">
              <a class="ant-dropdown-link" href="#">
                <a-icon type="ellipsis" />
              </a>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a href="javascript:;">{{ $t('dashboard.analysis.dropdown-option-one') }}</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;">{{ $t('dashboard.analysis.dropdown-option-two') }}</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
            <a-row :gutter="68">
<!--              <a-col :xs="24" :sm="12" :style="{ marginBottom: ' 24px' }">-->
<!--                <number-info :total="12321" :sub-total="17.1">-->
<!--                  <span slot="subtitle">-->
<!--                    <span>{{ $t('dashboard.analysis.search-users') }}</span>-->
<!--                    <a-tooltip :title="$t('dashboard.analysis.introduce')" slot="action">-->
<!--                      <a-icon type="info-circle-o" :style="{ marginLeft: '8px' }" />-->
<!--                    </a-tooltip>-->
<!--                  </span>-->
<!--                </number-info>-->
<!--                &lt;!&ndash; miniChart &ndash;&gt;-->
<!--                <div>-->
<!--                  <mini-smooth-area :style="{ height: '45px' }" :dataSource="searchUserData"-->
<!--                                    :scale="searchUserScale" />-->
<!--                </div>-->
<!--              </a-col>-->
<!--              <a-col :xs="24" :sm="12" :style="{ marginBottom: ' 24px' }">-->
<!--                <number-info :total="9835" :sub-total="26.2" status="down">-->
<!--                  <span slot="subtitle">-->
<!--                    <span>{{ $t('dashboard.analysis.per-capita-search') }}</span>-->
<!--                    <a-tooltip :title="$t('dashboard.analysis.introduce')" slot="action">-->
<!--                      <a-icon type="info-circle-o" :style="{ marginLeft: '8px' }" />-->
<!--                    </a-tooltip>-->
<!--                  </span>-->
<!--                </number-info>-->
<!--                &lt;!&ndash; miniChart &ndash;&gt;-->
<!--                <div>-->
<!--                  <mini-smooth-area :style="{ height: '45px' }" :dataSource="searchUserData"-->
<!--                                    :scale="searchUserScale" />-->
<!--                </div>-->
<!--              </a-col>-->
            </a-row>
            <div class="ant-table-wrapper">
              <a-table row-key="index" size="small" :columns="searchTableColumns"
                       :dataSource="searchData" :pagination="{ pageSize: 5 }">
                <span slot="range" slot-scope="text, record">
                  <trend :flag="record.status === 1 ? 'up' : 'down'">{{ text }}%</trend>
                </span>
              </a-table>
            </div>
          </a-card>
        </a-col>
        <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card class="antd-pro-pages-dashboard-analysis-salesCard" :loading="loading"
                  :bordered="false" title="出入库任务占比" :style="{ height: '100%' }">
            <div slot="extra" style="height: inherit">
              <!-- style="bottom: 12px;display: inline-block;" -->
              <span class="dashboard-analysis-iconGroup">
<!--                <a-dropdown :trigger="['click']" placement="bottomLeft">-->
                <!--                  <a-icon type="ellipsis" class="ant-dropdown-link" />-->
                <!--                  <a-menu slot="overlay">-->
                <!--                    <a-menu-item>-->
                <!--                      <a href="javascript:;">{{ $t('dashboard.analysis.dropdown-option-one') }}</a>-->
                <!--                    </a-menu-item>-->
                <!--                    <a-menu-item>-->
                <!--                      <a href="javascript:;">{{ $t('dashboard.analysis.dropdown-option-two') }}</a>-->
                <!--                    </a-menu-item>-->
                <!--                  </a-menu>-->
                <!--                </a-dropdown>-->
              </span>
              <!--              <div class="analysis-salesTypeRadio">-->
              <!--                <a-radio-group defaultValue="a">-->
              <!--                  <a-radio-button value="a">{{ $t('dashboard.analysis.channel.all') }}-->
              <!--                  </a-radio-button>-->
              <!--                  <a-radio-button value="b">{{ $t('dashboard.analysis.channel.online') }}-->
              <!--                  </a-radio-button>-->
              <!--                  <a-radio-button value="c">{{ $t('dashboard.analysis.channel.stores') }}-->
              <!--                  </a-radio-button>-->
              <!--                </a-radio-group>-->
              <!--              </div>-->
            </div>
            <h4>{{ $t('dashboard.analysis.sales') }}</h4>
            <div>
              <!-- style="width: calc(100% - 240px);" -->
              <div>
                <v-chart :force-fit="true" :height="405" :data="pieData" :scale="pieScale">
                  <v-tooltip :showTitle="false" dataKey="item*percent" />
                  <v-axis />
                  <!-- position="right" :offsetX="-140" -->
                  <v-legend dataKey="item" />
                  <v-pie position="percent" color="item" :vStyle="pieStyle" />
                  <v-coord type="theta" :radius="0.75" :innerRadius="0.6" />
                </v-chart>
              </div>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import {
  ChartCard,
  MiniArea,
  MiniBar,
  MiniProgress,
  RankList,
  Bar,
  Trend,
  NumberInfo,
  MiniSmoothArea
} from '@/components'
import { baseMixin } from '@/store/app-mixin'
// import { materialChart, dayChart, libraryStatement, pieChart } from '@/api/statistic'
import { libraryStatement, materialChart, pieChart, dayChart } from '@/api/statistic'

const barData = []
const barData2 = []

const rankList = []
const rankList2 = []

const searchUserData = []
for (let i = 0; i < 7; i++) {
  searchUserData.push({
    x: moment().add(i, 'days').format('YYYY-MM-DD'),
    y: Math.ceil(Math.random() * 10)
  })
}
const searchUserScale = [
  {
    dataKey: 'x',
    alias: '时间'
  },
  {
    dataKey: 'y',
    alias: '任务数量',
    min: 0,
    max: 10
  }
]

const searchData = []

const DataSet = require('@antv/data-set')

const sourceData = []

const pieScale = [
  {
    dataKey: 'percent',
    min: 0,
    formatter: '.0%'
  }
]
const pieData = []

export default {
  name: 'Analysis',
  mixins: [baseMixin],
  components: {
    ChartCard,
    MiniArea,
    MiniBar,
    MiniProgress,
    RankList,
    Bar,
    Trend,
    NumberInfo,
    MiniSmoothArea
  },
  data() {
    return {
      loading: true,
      rankList,
      rankList2,

      // 搜索任务数量
      searchUserData,
      searchUserScale,
      searchData,

      barData,
      barData2,

      //
      pieScale,
      pieData,
      sourceData,
      pieStyle: {
        stroke: '#fff',
        lineWidth: 1
      }
    }
  },
  computed: {
    searchTableColumns() {
      return [
        {
          dataIndex: 'index',
          title: '排名',
          width: 90
        },
        {
          dataIndex: 'materialname',
          title: '物料名称'
        },
        {
          dataIndex: 'num',
          title: '物料库存'
        }
      ]
    }
  },
  created() {
    this.libraryStatementOut()
    this.libraryStatementIn()
    this.materialChartOut()
    this.materialChartIn()
    this.pieChartQuery()
    this.dayChartQuery()
    setTimeout(() => {
      this.loading = !this.loading
    }, 1000)
  },
  methods: {
    libraryStatementOut() {
      const storageTypeText = JSON.parse(localStorage.getItem('storageTypeText'))
      libraryStatement({ type: 0, material_storage_area: storageTypeText }).then(res => {
        console.log(res)
        if (res.status) {
          this.barData = res.result
        }
      })
    },
    libraryStatementIn() {
      const storageTypeText = JSON.parse(localStorage.getItem('storageTypeText'))
      libraryStatement({ type: 1, material_storage_area: storageTypeText }).then(res => {
        console.log(res)
        if (res.status) {
          this.barData2 = res.result
        }
      })
    },
    materialChartOut() {
      const storageTypeText = JSON.parse(localStorage.getItem('storageTypeText'))
      materialChart({ type: 0, material_storage_area: storageTypeText }).then(res => {
        if (res.status) {
          this.rankList = res.result
        }
      })
    },
    materialChartIn() {
      const storageTypeText = JSON.parse(localStorage.getItem('storageTypeText'))
      materialChart({ type: 1, material_storage_area: storageTypeText }).then(res => {
        if (res.status) {
          this.rankList2 = res.result
        }
      })
    },
    pieChartQuery() {
      const storageTypeText = JSON.parse(localStorage.getItem('storageTypeText'))
      pieChart({ material_storage_area: storageTypeText }).then(res => {
        if (res.status) {
          const dv = new DataSet.View().source(res.result)
          dv.transform({
            type: 'percent',
            field: 'count',
            dimension: 'item',
            as: 'percent'
          })
          this.pieData = dv.rows
        }
      })
    },
    dayChartQuery() {
      const storageTypeText = JSON.parse(localStorage.getItem('storageTypeText'))
      dayChart({ material_storage_area: storageTypeText }).then(res => {
        if (res.status) {
          this.searchData = res.result
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.extra-wrapper {
  line-height: 55px;
  padding-right: 24px;

  .extra-item {
    display: inline-block;
    margin-right: 24px;

    a {
      margin-left: 24px;
    }
  }
}

.antd-pro-pages-dashboard-analysis-twoColLayout {
  position: relative;
  display: flex;
  display: block;
  flex-flow: row wrap;
}

.antd-pro-pages-dashboard-analysis-salesCard {
  height: calc(100% - 24px);

  :deep(.ant-card-head) {
    position: relative;
  }
}

.dashboard-analysis-iconGroup {
  i {
    margin-left: 16px;
    color: rgba(0, 0, 0, 0.45);
    cursor: pointer;
    transition: color 0.32s;
    color: black;
  }
}

.analysis-salesTypeRadio {
  position: absolute;
  right: 54px;
  bottom: 12px;
}
</style>
