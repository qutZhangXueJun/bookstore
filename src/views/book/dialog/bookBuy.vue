<template>
    <el-dialog :visible="isShow" :title="title" center @close="closeDialog" @open="openDialog">
      <el-card>
        <el-form ref="addData" :model="addData" :rules="rules" label-width="100px" label-position="left">
          <el-row :gutter="30">
            <el-col :span="12">
              <el-form-item porp="userName" label="用户名">
                <el-input v-model="addData.userName" placeholder="用户名" :disabled="isDisabled"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="isbn" label="序列号:">
                <el-input v-model="addData.isbn" placeholder="序列号" :disabled="isDisabled"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="count" label="数量">
                <el-input v-model="addData.inventory" placeholder="数量"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <div style="text-align:right;margin:20px 0">
        <el-button size="mini" @click="closeDialog">取消</el-button>
        <el-button type="primary" size="mini" @click="getDate(scope)">确认</el-button>
      </div>
    </el-dialog>
</template>

<script>
import { commonAPI } from '@/api/commonAPI'
export default {
  name: 'buyBook',
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
        userName: '',
        isbn: '',
        count: Number,
        orderDate: ''
      },
      tableData: [],
      orderName: [],
      title: '',
      flag: false,
      formQuery: {
        userName: '',
        isbn: '',
        acount: Number,
        orderDate: ''
      },
      buyManage: {
        userName: '',
        isnb: '',
        count: Number,
        orderDate: ''
      },
      isDisabled: false,
      rules: {
        userName: [{ required: true, message: '请输入', trigger: 'blur' }],
        isbn: [{ required: true, message: '请输入', trigger: 'blur' }],
        acount: [{ required: true, message: '请输入购买数量', trigger: 'blur' },
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
  created () {
    this.getData()
  },
  methods: {
    // getData () {
    //   this.loading = true
    //   commonAPI('queryBookList', this.formQuery)
    //     .then(res => {
    //       console.log(res.data)
    //       this.loading = false
    //       this.tableData = res.data.data.rows
    //     })
    // },
    getData (val) {
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
      if (this.flag === false) {
        this.$refs.addData.validate(valid => {
          if (valid) {
            if (this.isDisabled === false) { // 购买图书
              commonAPI('queryOrderByDate', { userName: this.$store.state.userName, isbn: val.row.isbn })
                .then(res => {
                  var i = res.data.data.rows.length - 1
                  if (res.data.data.rows[i].isbn === true) {
                    this.$message({
                      message: '已购买此书',
                      type: 'warning'
                    })
                  } else if (val.row.inventory <= 0) {
                    this.$message({
                      message: '书籍已没有库存',
                      type: 'warning'
                    })
                  } else {
                    this.buyBook(val, time)
                  }
                })
            }
          }
        })
      }
    },
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
    buyBook (val, time) {
      this.loading = true
      this.buyManage.userName = this.$store.state.userName
      this.buyManage.isbn = val.row.isbn
      this.buyManage.orderDate = time
      commonAPI('addOrder', this.addData)
        .then(res => {
          var total = val.row.inventory - 1
          commonAPI('updateInventory', { inventory: total, isbn: val.row.isbn })
            .then(res1 => {
              this.loading = false
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
