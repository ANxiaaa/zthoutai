<template>
    <div class="toolbar" id="filterTool" style="float:right;padding-top:10px;padding-right:15px;">
        <el-form :inline="true" :size="size">
            <el-form-item>
                <el-button-group>
                <el-tooltip content="刷新" placement="top" v-if="showrefresh">
                    <el-button icon="fa fa-refresh" @click="findPage"></el-button>
                </el-tooltip>
                <el-tooltip content="列显示" placement="top">
                    <el-button icon="fa fa-filter" @click="displayFilterColumnsDialog"></el-button>
                </el-tooltip>
                <el-tooltip content="导出" placement="top" v-if="showexcel">
                    <el-button icon="fa fa-file-excel-o"></el-button>
                </el-tooltip>
                </el-button-group>
            </el-form-item>
        </el-form>
        <!--表格显示列界面-->
        <table-column-filter-dialog ref="tableColumnFilterDialog" :columns="columns" @handleFilterColumns="handleFilterColumns">
        </table-column-filter-dialog>
    </div>
</template>
<script>
import axios from 'axios';
import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog"
export default {
    name:'filter-tool',
    components:{
        TableColumnFilterDialog
    },
    props:{
        columns:{
            type: Array,
            default: []
        },
        showrefresh:{
            type: Boolean,
            default: true
        },
        showexcel:{
            type:Boolean,
            default:true
        }
    },
    data (){
        return {
            size: 'small',
            filterColumns:[]
        }
    },
    methods:{
        // 处理表格列过滤显示
      	displayFilterColumnsDialog: function () {
			this.$refs.tableColumnFilterDialog.setDialogVisible(true)
      	},
		// 处理表格列过滤显示
      	handleFilterColumns: function (data) {
            console.log(data)
            this.$emit('setColumns',data.filterColumns)
			this.$refs.tableColumnFilterDialog.setDialogVisible(false)
      	},
        findPage(){
            this.$emit('findPage')
        }
    }
}
</script>

