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
          <el-form ref="bookData" :model="bookData" label-width="100px" label-position="left">
            <el-col :span="12">
              <el-form-item prop="inventory" label="剩余图书数量">
                <el-input v-model="bookData.inventory" placeholder="剩余库存" :disabled="isDisabled"/>
              </el-form-item>
            </el-col>
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
      bookData: {
        isbn: '',
        bookName: '',
        author: '',
        publish: '',
        price: Number,
        inventory: Number
      },
      userName: [],
      title: '',
      flag: false,
      editManage: {
        userName: '',
        isbn: '',
        inventory: Number,
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
      this.bookData = JSON.parse(JSON.stringify(this.option.tableDataBook))
    },
    closeDialog () {
      this.$refs.addData.resetFields()
      this.option.isShow = false
      this.flag = false
      this.$emit('refreshTable')
    },
    editOrder () {
      var chazhi = 0
      var oriCount = this.addData.count
      var nowCount = this.addData.reCount
      this.editManage.count = this.addData.count
      if (this.flag === false) {
        this.$refs.addData.validate(valid => {
          if (valid) {
            if (this.isDisabled !== false) {
              commonAPI('editOrder', { count: nowCount, oId: this.addData.oId })
                .then(res => {
                  if (oriCount >= nowCount) {
                    chazhi = oriCount - nowCount
                    this.editManage.inventory = this.bookData.inventory + chazhi
                    commonAPI('updateInventory', { inventory: this.editManage.inventory, isbn: this.addData.isbn })
                      .then(res1 => {
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
                  } else {
                    chazhi = nowCount - oriCount
                    this.editManage.inventory = this.bookData.inventory - chazhi
                    commonAPI('updateInventory', { inventory: this.editManage.inventory, isbn: this.addData.isbn })
                      .then(res1 => {
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
