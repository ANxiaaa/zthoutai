<template>
  <div>
    <!--表格栏-->
    <el-table :data="data.content" :highlight-current-row="highlightCurrentRow"
    @selection-change="selectionChange" row-key="id"
          @current-change="handleCurrentChange" v-loading="loading" :element-loading-text="$t('action.loading')" :border="border" :stripe="stripe"
          :show-overflow-tooltip="showOverflowTooltip" :max-height="maxHeight" :size="size" :align="align" style="width:100%;max-height:631px" >
      <el-table-column type="selection" width="50" v-if="showBatchDelete & showOperation"></el-table-column>
      <el-table-column v-for="column in columns" header-align="center" align="center"
        :prop="column.prop" :label="column.label" :width="column.width" :min-width="column.minWidth"
        :fixed="column.fixed" :key="column.prop" :type="column.type" :formatter="column.formatter"
        :sortable="column.sortable==null?true:column.sortable">
      </el-table-column>
      <el-table-column :label="$t('action.operation')" :width="width" fixed="right" v-if="showOperation" header-align="center" align="center" :class-name="'btnbox'">
        <template slot-scope="scope">
          <kt-button icon="fa fa-edit" :label="$t('action.edit')" :perms="permsEdit" :size="size" @click="handleEdit(scope.$index, scope.row)" />
          <slot name="ktbtna"></slot>
          <kt-button icon="fa fa-trash" :label="$t('action.delete')" :perms="permsDelete" :size="size" type="danger" @click="handleDelete(scope.$index, scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <!--分页栏-->
    <div class="toolbar" style="padding:10px;">
      <kt-button :label="$t('action.batchDelete')" :perms="permsDelete" :size="size" type="danger" @click="handleBatchDelete()"
        :disabled="this.selections.length===0" style="float:left;" v-if="showBatchDelete & showOperation"/>
      <el-pagination layout="total, prev, pager, next, jumper" @current-change="refreshPageRequest"
        :current-page="pageRequest.pageNum" :page-size="pageRequest.pageSize" :total="data.totalSize" style="float:right;">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import KtButton from "@/views/Core/KtButton"
export default {
  name: 'KtTable',
  components:{
			KtButton
	},
  props: {
    columns: Array, // 表格列配置
    data: Object, // 表格分页数据
    permsEdit: String,  // 编辑权限标识
    permsDelete: String,  // 删除权限标识
    width:{
      type: Number,
      default: 185
    },
    size: { // 尺寸样式
      type: String,
      default: 'mini'
    },
    align: {  // 文本对齐方式
      type: String,
      default: 'left'
    },
    maxHeight: {  // 表格最大高度
      type: Number,
      default: 520
    },
    showOperation: {  // 是否显示操作组件
      type: Boolean,
      default: true
    },
    border: {  // 是否显示边框
      type: Boolean,
      default: false
    },
    stripe: {  // 是否显示斑马线
      type: Boolean,
      default: true
    },
    highlightCurrentRow: {  // // 是否高亮当前行
      type: Boolean,
      default: true
    },
    showOverflowTooltip: {  // 是否单行显示
      type: Boolean,
      default: true
    },
    showBatchDelete: {  // 是否显示操作组件
      type: Boolean,
      default: true
    },
    dict: {
      type: Boolean,
      default: false
    },
    findTree:{
      type: Function,
      default: function(){}
    }
  },
  data() {
    return {
      // 分页信息
			pageRequest: {
				pageNum: 1,
        pageSize: 10
      },
      loading: false,  // 加载标识
      selections: []  // 列表选中列
    }
  },
  methods: {
    // 分页查询
    findPage: function () {
            console.log(this.pageRequest)
        this.loading = true
        let callback = res => {
          this.loading = false
        }
      this.$emit('findPage', {pageRequest:this.pageRequest, callback:callback})
    },
    // 选择切换
    selectionChange: function (selections) {
            console.log(1)
      this.selections = selections
      this.$emit('selectionChange', {selections:selections})
    },
    // 选择切换
    handleCurrentChange: function (val) {
            console.log(1)
      this.$emit('handleCurrentChange', {val:val})
    },
    // 换页刷新
		refreshPageRequest: function (pageNum) {
            console.log(pageNum)
      this.pageRequest.pageNum = pageNum
      this.findPage()
    },
    // 编辑
		handleEdit: function (index, row) {
            console.log(1)
      this.$emit('handleEdit', {index:index, row:row})
		},
    // 删除
		handleDelete: function (index, row) {
            console.log(1)
			this.delete(row.id)
		},
		// 批量删除
		handleBatchDelete: function () {
            console.log(1)
			let ids = this.selections.map(item => item.id).toString()
			this.delete(ids)
		},
		// 删除操作
		delete: function (ids) {
            console.log(1)
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
			}).then(() => {
        let params = []
				let idArray = (ids+'').split(',')
				for(var i=0; i<idArray.length; i++) {
          params.push({'id':idArray[i]})
        }
        this.loading = true
        let callback = res => {
          if(res.code == 200) {
            console.log(callback)
            this.$message({message: '删除成功', type: 'success'})
            this.findPage();
            if(this.dict)this.findTree();
          } else {
            this.$message({message: '操作失败, ' + res.msg, type: 'error'})
          }
          this.loading = false
        }
        this.$emit('handleDelete', {params:params, callback:callback})
			}).catch(() => {
			})
    },
    getBtnbox(){
      setTimeout(()=>{
        let a = document.querySelectorAll('.btnbox')
        let aBtnbox = [];
        let btnWidth = 0;
        a.forEach((i, index)=>{
          if(i.tagName == 'TH'){
            btnWidth = i.offsetWidth;
          }
          if(i.tagName == 'TD' && i.children[0].children.length > 3){
            let j = i.children[0].children;
            i.children[0].style.height = j[0].offsetHeight + 'px';
            i.children[0].style.width = '100%';
            i.children[0].style.position = 'relative';
            i.children[0].style.top = '0';
            i.children[0].style.transition = 'height .3s';
            i.children[0].parentElement.style.position = 'fixed';
            i.children[0].parentElement.style.width = btnWidth + 'px';
            i.children[0].parentElement.style.display = 'flex';
            i.children[0].parentElement.style.alignItems = 'center';
            i.children[0].parentElement.style.height = '36px';
            for(let n = 0;n < j.length;n ++){
              j[n].style.margin = '0px';
              j[n].style.width = '100%';
              j[n].style.position = 'relative';
              j[n].onmouseover = function(){
                // this.parentElement.style.overflow = 'inherit'
                this.parentElement.style.height = this.offsetHeight * j.length + 'px';
                this.parentElement.parentElement.style.zIndex = '9999'
              }
              j[n].onmouseout = function(){
                // this.parentElement.style.overflow = 'hidden'
                this.parentElement.style.height = this.offsetHeight + 'px';
                this.parentElement.parentElement.style.zIndex = '2'
              }
            }
          }
        })
      },80)
    }
  },
  mounted() {
    this.refreshPageRequest(1)
  },
  updated(){
    this.getBtnbox()
  }
}
</script>

<style scoped>
</style>