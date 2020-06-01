<template>
    <el-dialog
      :visible.sync="isShow"
      :title="title"
      center
      @close = "closeDialog"
      @open = "openDialog"
      >
        <el-card>
          <el-form ref="addData" :model="addData" :rules="rules" label-width="100px" label-position="left">
            <el-row :gutter="30">
              <el-col :span="12">
                <el-form-item prop="userName" label="用户名:">
                  <el-input v-model="addData.userName" placeholder="用户名" :disabled="isDisabled"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="isbn" label="序列号:">
                  <el-input v-model="addData.isbn" placeholder="序列号" :disabled="isDisabled"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="count" label="原订购量">
                  <el-input v-model="addData.count" placeholder="数量" :disabled="isDisabled"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="reCount" label="现订购量">
                  <el-input v-model="addData.reCount" placeholder="10"/>
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
        oId: Number,
        userName: '',
        isbn: '',
        count: Number,
        reCount: Number
      },
      userName: [],
      title: '',
      flag: false,
      editManage: {
        userName: '',
        isbn: '',
        count: Number,
        orderDate: ''
      },
      isDisabled: false,
      rules: {
        count: [{ required: true, message: '请重新输入购买数量', trigger: 'blur' }, { trigger: 'blur', validator: isNumber }]
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
      this.editManage.count = this.addData.count
      if (this.flag === false) {
        this.$refs.addData.validate(valid => {
          if (valid) {
            if (this.isDisabled !== false) {
              commonAPI('editOrder', { count: this.editManage.count, oId: this.addData.oId })
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
            }
          }
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
