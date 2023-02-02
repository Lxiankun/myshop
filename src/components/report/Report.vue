<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
      <div id="main" style="width: 750px; height: 400px"></div>
    </el-card>
  </div>
</template>
<script>
// 引入echarts
import * as echarts from "echarts";
import _ from "lodash";
export default {
  components: {},
  props: {},
  data() {
    return {
      //需要合并的数据
      option: {
        title: {
          text: "用户来源",
        },
        tooltip: {},

        xAxis: {
          data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
        },
        yAxis: {},
        series: [
          {
            name: "销量",
            type: "bar",
            data: [5, 20, 36, 10, 10, 20],
          },
        ],
      },
    };
  },
  computed: {},
  watch: {},
  //方法集合
  methods: {},
  created() { },
  async mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("main"));
    // 获取数据
    const { data: res } = await this.$http.get("reports/type/1");
    if (res.meta.status != 200) {
      return this.$message.error("获取数据失败");
    }
    // // 指定图表的配置项和数据
    const result = _.merge(res.data, this.option);

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(result);
  },
  beforeCreate() { }, //生命周期 - 创建之前
  beforeMount() { }, //生命周期 - 挂载之前
  beforeUpdate() { }, //生命周期 - 更新之前
  updated() { }, //生命周期 - 更新之后
  beforeDestroy() { }, //生命周期 - 销毁之前
  destroyed() { }, //生命周期 - 销毁完成
  activated() { }, //如果页面有 keep-alive 缓存功能，这个函数会触发
};
</script>
<style lang='less' scoped>

</style>