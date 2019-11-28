<template>
    <el-dialog title="修改密码" :visible.sync="dialogVisible" width="30%" :modal-append-to-body="false">
    <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
        <el-form-item label="原始密码" prop="oriPass">
            <el-input type="password" v-model="ruleForm2.oriPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
            <el-input type="password" v-model="ruleForm2.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="ruleForm2.checkPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
            <el-button @click="resetForm('ruleForm2')">重置</el-button>
        </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import axios from 'axios';
export default {
    data (){
         var validateOriPass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入原始密码'));
            }else{
                callback();
            }
        };
            var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
            if (this.ruleForm2.checkPass !== '') {
                this.$refs.ruleForm2.validateField('checkPass');
            }
            callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.ruleForm2.pass) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
             ruleForm2: {
                oriPass: '',
                pass: '',
                checkPass: ''
            },
            rules2: {
                oriPass:[
                    {validator: validateOriPass, trigger: 'blur'}
                ],
                pass: [
                    { validator: validatePass, trigger: 'blur' }
                ],
                checkPass: [
                    { validator: validatePass2, trigger: 'blur' }
                ]
            },
            dialogVisible: false //是否显示
        }
    },
    methods:{
        setUpdatePwdVisible: function(updatePwdVisible){
            this.dialogVisible = updatePwdVisible
        },
        submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
              let params = Object.assign({}, this.ruleForm2)
              this.$api.user.updatePassword(params).then((res) => {
                if(res.code == 200) {
                    this.$message({ message: '操作成功', type: 'success' })
                    this.dialogVisible = false
                    this.$refs[formName].resetFields()
                } else {
                    this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                }
            })
            // alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
}
</script>

