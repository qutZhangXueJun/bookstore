<template>
  <el-container>
    <el-header style="background-color:white">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini">
        <el-form-item label="用户名">
          <el-input v-model="formQuery.userName" placeholder="用户名"/>
        </el-form-item>
        <el-form-item label="下单时间">
          <el-date-picker class="dateStyle" v-model="formInline.beginTime" value-format="yyyy-MM-dd HH:mm:ss"
                          @change="dataFormat" type="datetime" placeholder="选择日期时间"/>
          至&nbsp;
          <el-date-picker class="dateStyle" v-model="formInline.endTime" value-format="yyyy-MM-dd HH:mm:ss"
                                 @change="dataFormat" type="datetime" placeholder="选择日期时间"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btn" @click="onSubmit"><i class="el-icon-search"/>查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" class="btn" @click="resetting"><i class="el-icon-refresh"/>重置</el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main class="elMain">
      <el-table v-loading="loading" :data="tableData" height="100%" stripe border size="mini">
        <el-table-column align="center" label="用户名" prop="userName"/>
        <el-table-column align="center" label="序列号" prop="isbn"/>
        <el-table-column align="center" label="数量" prop="count"/>
        <el-table-column align="center" label="下单时间" prop="orderDate"/>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="OrderManage(scope)">编辑</el-button>
            <el-button size="mini" :disabled="disabled" @click="delOrder(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <div style="padding: 15px 0;text-align: right;">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="formInline.pageNum"
                       :page-sizes="pageSizes" :page-size="formInline.pageSize" layout="total, sizes, prev, pager, next, jumper"
                       :total="pageTotal">
        </el-pagination>
      </div>
    </el-footer>
    <!-- 组件 -->
    <orderEditor :option="editOrder" @refreshTable="getData"/>
  </el-container>
</template>

<script>

import { commonAPI } from '../../api/commonAPI'
import { formatDate } from '@/utils/index'
import orderEditor from './dialog/orderEditor'

export default {
  components: { orderEditor },
  data () {
    return {
      formQuery: {
        userName: '',
        isbn: '',
        pageNum: 1,
        pageSize: 10
      },
      tableData: [],
      loading: false,
      formInline: {
        pageNum: 1,
        pageSize: 10,
        beginTime: new Date(new Date().getTime() - 3600 * 1000 * 24 * 7),
        endTime: new Date()
      },
      pageSizes: [5, 10, 20, 40],
      subManage: {
        oId: Number,
        userName: '',
        isbn: '',
        count: '',
        orderDate: ''
      },
      editOrder: {
        title: '',
        isShow: false,
        tableData: [],
        isDisabled: false
      },
      pageTotal: 0
    }
  },
  created () {
    this.formInline.beginTime = formatDate(this.formInline.beginTime, true)
    this.formInline.endTime = formatDate(this.formInline.endTime, true)
    this.getData()
  },
  methods: {
    getData () {
      this.loading = true
      commonAPI('queryOrderByDate', this.formInline)
        .then(res => {
          this.loading = false
          this.tableData = res.data.data.rows
          this.pageTotal = res.data.data.total
        })
    },
    dataFormat (val) {
      console.log(val)
    },
    onSubmit () { // 查询
      this.getData()
    },
    resetting () { // 重置
      this.formInline.beginTime = formatDate(new Date(new Date().getTime() - 3600 * 1000 * 24 * 7), true)
      this.formInline.endTime = formatDate(new Date(), true)
      this.formQuery.userName = ''
      this.getData()
    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`);
      this.formInline.pageSize = val
      this.formInline.pageNum = 1
      this.getData()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`);
      this.formInline.pageNum = val
      this.getData()
    },
    OrderManage (val) {
      this.editOrder.isShow = true
      this.editOrder.title = '编辑订单'
      this.editOrder.tab = val.row
      this.editOrder.isDisabled = true
    },
    delOrder (val) {
      this.loading = true
      const oId = val.row.oId
      commonAPI('delOrder', { oId: oId })
        .then(res => {
          this.loading = false
          if (res.data.data === 'OK') {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getData()
          } else {
            this.$message({
              message: '删除失败',
              type: 'warning'
            })
          }
        })
    }
  }
}

</script>

<style scoped>
  .dateStyle,.btn {
    margin-top: 18px;
  }
  .elMain {
    height: 418px;
  }
</style>

<style>
  .el-main {
    padding: 5px 10px;
  }

  .el-table th {
    height: 45px;
    font-size: 16px;
    font-family: 微软雅黑,serif;
    font-weight: 500;
    color: darkblue;
  }

  body {
    margin: 0;
  }
</style>
