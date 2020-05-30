<template>
    <el-dialog
      :visible.sync="isShow"
      :title="title"
      center
      @close = "closeDialog"
      @open = "openDialog"
      >
        <el-card>
          <el-form ref="addData" :model="addData" :rules="rules" lable-width="100px" label-position="left">
            <el-row :gutter="30">
              <el-col :span="12">
                <el-form-item prop="userName" lable="用户名：">
                  <el-input v-model="editOrder.userName" placeholder="用户名" :disabled="isDisabled"/>
                </el-form-item>
                <el-form-item prop="isbn" lable="isbn：">
                  <el-input v-model="editOrder.isbn" placeholder="isbn" :disabled="isDisabled"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="30">
              <el-col :span="12">
                <el-form-item prop="count" lable="数量：">
                  <el-input v-model="editOrder.count" placeholder="数量"/>
                </el-form-item>
                <el-form-item prop="orderDate" lable="下单时间：">
                  <el-input v-model="editOrder.orderDate" placeholder="下单时间"/>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
        <div style="text-align:right;margin:20px 0">
          <el-button size="mini" @click="closeDialog">取消</el-button>
          <el-button type="primary" size="mini" @click="editOrder">确认</el-button>
        </div>
    </el-dialog>
</template>

<script>

import { commonAPI } from '@/api/commonAPI'

export default {
  name: 'orderEditor',
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
        count: Number
      },
      userName: [],
      title: '',
      flag: false,
      formQuery: {
        userName: '',
        isbn: '',
        pageNum: 1,
        pageSize: 10
      },
      isDisabled: false,
      rules: {
        isbn: [{ required: true, message: '请输入isbn', trigger: 'blur' }],
        userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        author: [{ required: true, message: '请输入购买数量', trigger: 'blur' }]
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
    editOrder () {
      if (this.flag === false) {
        this.$refs.addData.validate(valid => {
          commonAPI('editOrder', this.addData)
            .then(res => {
              this.option.isShow = false
              if (res.data.data === 'OK') {
                this.$message({
                  showClose: true,
                  message: '修改成功',
                  type: 'success'
                })
              } else {
                this.$message.error('修改失败，请重试')
              }
            })
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
