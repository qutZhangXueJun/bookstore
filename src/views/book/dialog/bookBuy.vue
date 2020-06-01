<template>
    <el-dialog :visible="isShow" :title="title" center @close="closeDialog" @open="openDialog">
      <el-card>
        <el-form ref="addData" :model="addData" :rules="rules" label-width="100px" label-position="left">
          <el-row :gutter="30">
            <el-col :span="12">
              <el-form-item prop="bookName" label="图书名称:">
                <el-input v-model="addData.bookName" placeholder="图书名称" :disabled="isDisabled"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="isbn" label="序列号:">
                <el-input v-model="addData.isbn" placeholder="序列号" :disabled="isDisabled"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="count" label="数量">
                <el-input v-model="addData.count" placeholder="数量"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="inventory" label="剩余图书数量">
                <el-input v-model="addData.inventory" placeholder="库存" :disabled="isDisabled"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <div style="text-align:right;margin:20px 0">
        <el-button size="mini" @click="closeDialog">取消</el-button>
        <el-button type="primary" size="mini" @click="buyBook">确认</el-button>
      </div>
    </el-dialog>
</template>

<script>
import { commonAPI } from '@/api/commonAPI'

export default {
  props: {
    option: Object
  },
  data () {
    const isNumber = (rule, value, callback) => {
      if (!Number(value)) {
        callback(new Error('只能为数字'))
      } else {
        callback()
      }
    }
    return {
      addData: {
        bId: Number,
        bookName: '',
        isbn: '',
        count: Number,
        inventory: Number
      },
      tableData: [],
      orderName: [],
      title: '',
      flag: false,
      buyManage: {
        userName: '',
        isbn: '',
        count: Number,
        orderDate: ''
      },
      isDisabled: false,
      rules: {
        userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        count: [{ required: true, message: '请输入购买数量', trigger: 'blur' },
          { trigger: 'blur', validator: isNumber }]
      }
    }
  },
  computed: {
    isShow: {
      // 修改用户弹窗是否显示
      get: function () {
        return this.option.isShow
      },
      set: function (newValue) {
        this.option.isShow = newValue
      }
    }
  },
  methods: {
    openDialog () {
      this.title = this.option.title
      this.isDisabled = this.option.isDisabled
      this.addData = JSON.parse(JSON.stringify(this.option.tableData))
    },
    closeDialog () {
      this.$refs.addData.resetFields()
      this.option.isShow = false
      this.flag = false
      this.$emit('refreshTable')
    },
    buyBook () {
      var now = new Date()
      var year = now.getFullYear()
      var month = now.getMonth()
      var date = now.getDate()
      var hour = now.getHours()
      var minu = now.getMinutes()
      var sec = now.getSeconds()// 得到秒
      month = month + 1
      if (month < 10) month = '0' + month
      if (date < 10) date = '0' + date
      if (hour < 10) hour = '0' + hour
      if (minu < 10) minu = '0' + minu
      if (sec < 10) sec = '0' + sec
      var time = ''
      time = year + '-' + month + '-' + date + ' ' + hour + ':' + minu + ':' + sec
      this.loading = true
      this.buyManage.userName = this.$store.state.userName
      this.buyManage.isbn = this.addData.isbn
      this.buyManage.count = this.addData.count
      this.buyManage.orderDate = time
      commonAPI('addOrder', this.buyManage)
        .then(res => {
          var total = this.addData.inventory - this.addData.count
          commonAPI('updateInventory', { inventory: total, bId: this.addData.bId })
            .then(res1 => {
              this.loading = false
              this.option.isShow = false
              console.log('res', res1)
              if (res1.data.data === 'OK') {
                this.$message({
                  showClose: true,
                  message: '购买成功',
                  type: 'success'
                })
              } else {
                this.$message.error('购买失败，请重试')
              }
            })
        })
    }
  }
}
</script>

<style scoped>

</style>
