<template>
  <div class="app-container" style="background-color: light-gray">
    <el-menu
      :default-active="tabActiveIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelectTab"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      style="
        justify-content: space-between;
        display: flex;
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
      "
    >
      <el-menu-item index="0">待制作</el-menu-item>
      <el-menu-item index="1">待取货</el-menu-item>
      <el-menu-item index="2">已完成</el-menu-item>
    </el-menu>
    <div class="scroll-view" v-if="tabActiveIndex == 0">
      <div
        class="cell-item-con"
        v-for="(item, index) in dataArr0"
        :key="item.out_trade_no"
      >
        <div class="pick-code">{{ item.pick_code }}</div>
        <div class="order-info">
          <div>姓名：{{ item.username }}</div>
          <div>电话：{{ item.mobile }}</div>
          <div>订单号：{{ item.out_trade_no }}</div>
          <div>下单时间：{{ item.order_time }}</div>
        </div>
        <div class="cell-action-con">
          <el-button size="small" type="primary" @click="previewTicket(index)"
            >预览小票</el-button
          >
          <el-button size="small" type="success" @click="manuComplete(index)"
            >制作完成</el-button
          >
        </div>
      </div>
    </div>

    <div class="scroll-view" v-if="tabActiveIndex == 1">
      <div
        class="cell-item-con"
        v-for="(item, index) in dataArr1"
        :key="item.out_trade_no"
      >
        <div class="pick-code">{{ item.pick_code }}</div>
        <div class="order-info">
          <div>姓名：{{ item.username }}</div>
          <div>电话：{{ item.mobile }}</div>
          <div>订单号：{{ item.out_trade_no }}</div>
          <div>下单时间：{{ item.order_time }}</div>
        </div>
        <div class="cell-action-con">
          <el-button size="small" type="success" @click="delivery(index)"
            >确认提货</el-button
          >
        </div>
      </div>
    </div>

    <div class="scroll-view" v-if="tabActiveIndex == 2">
      <div
        class="cell-item-con"
        v-for="item in dataArr2"
        :key="item.out_trade_no"
      >
        <div class="pick-code">{{ item.pick_code }}</div>
        <div class="order-info">
          <div>姓名：{{ item.username }}</div>
          <div>电话：{{ item.mobile }}</div>
          <div>订单号：{{ item.out_trade_no }}</div>
          <div>下单时间：{{ item.order_time }}</div>
        </div>
        <!-- <div class="cell-action-con">
          <el-button size="small" type="success" @click="delivery(index)"
            >已取货</el-button
          >
        </div> -->
      </div>
    </div>

    <el-dialog
      title="打印机列表"
      :visible="showPrinterList"
      width="80vw"
      :before-close="() => (showPrinterList = false)"
    >
      <el-table :data="printerList">
        <el-table-column label="name" prop="name" width="200"></el-table-column>
        <el-table-column
          label="description"
          prop="description"
          width="200"
        ></el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              @click="choosePrinter(scope.$index)"
              >使用</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog
      :visible="showPreviewTicket"
      title="预览"
      :before-close="() => (showPreviewTicket = false)"
      width="340px"
    >
      <div class="ticket-con">
        <div
          style="
            display: flex;
            flex-direction: row;
            width: 100%;
            justify-content: flex-start;
          "
        >
          <div style="font-size: 36px; font-weight: 700">
            {{ previewDataDic.pick_code }}
          </div>
        </div>
        <div
          style="
            display: flex;
            flex-direction: row;
            width: 100%;
            justify-content: space-between;
            font-size: 16px;
            margin-top: 6px;
          "
        >
          <div>自提时间：</div>
          <div>{{ previewDataDic.pick_time }}</div>
        </div>
        <div
          style="
            display: flex;
            flex-direction: row;
            width: 100%;
            justify-content: space-between;
            font-size: 16px;
            margin-top: 6px;
          "
        >
          <div>姓名：</div>
          <div>{{ previewDataDic.username }}</div>
        </div>
        <div
          style="
            display: flex;
            flex-direction: row;
            width: 100%;
            justify-content: space-between;
            font-size: 16px;
            margin-top: 6px;
          "
        >
          <div>电话：</div>
          <div>{{ previewDataDic.mobile }}</div>
        </div>
        <div
          style="
            margin-top: 12px;
            display: flex;
            flex-direction: row;
            width: 100%;
            justify-content: space-between;
            font-size: 20px;
            font-weight: 500;
          "
        >
          <div>商品</div>
          <div style="display: flex; flex-direction: row">
            <div style="margin-right: 28px">数量</div>
            <div>价格</div>
          </div>
        </div>

        <div
          class="product-cell"
          v-for="(item, index) in previewDataDic.product"
          :key="'product' + index"
        >
          <div class="product-info">
            <div style="font-size: 16px; font-weight: 500">{{ item.name }}</div>
            <div style="font-size: 12px; margin-top: 5px">
              {{ item.specifications.join("，") }}
            </div>
          </div>
          <div style="display: flex; flex-direction: row">
            <div
              style="
                font-size: 16px;
                width: 40px;
                margin-right: 26px;
                text-align: center;
              "
            >
              {{ item.num }}
            </div>
            <div style="font-size: 16px; width: 50px; text-align: center">
              {{ item.pay_price }}
            </div>
          </div>
        </div>
        <div class="ticket-total-price" style="margin-top: 12px">
          总价：{{ previewDataDic.finally_price }}
        </div>
        <div class="ticket-total-price" style="margin-top: 4px">
          支付方式：{{
            previewDataDic.channel == 1
              ? "内部福利卡"
              : previewDataDic.channel == 2
              ? "公司签单"
              : "微信支付"
          }}
        </div>
      </div>
      <div style="display: flex; flex-direction: row; margin-top: 22px">
        <div style="margin-left: auto">
          <el-button size="small" type="primary" @click="printSingleTicket"
            >打印</el-button
          >
        </div>
      </div>
    </el-dialog>

    <div>
      <webview
        v-show="false"
        :src="fullPath"
        webpreferences="contextIsolation=no,nodeIntegration,show=no"
      ></webview>
    </div>
  </div>
</template>

<script>
import raw from "@/views/print_temp/print.html?raw"; //此处就是html文件地址

import path from "path";
const ipcRenderer = require("electron").ipcRenderer;
// import { ipcRenderer } from "electron";
const synth = window.speechSynthesis;
const msg = new SpeechSynthesisUtterance();
import {
  listWelfareOrder,
  printOrder,
  updateWelfareOrderStatus,
} from "@/api/table";
export default {
  data() {
    return {
      fullPath: path.join(__static, "print.html"),
      tabActiveIndex: "0",
      dataArr0: [],
      dataArr1: [],
      dataArr2: [],

      printerName: "",
      printData: [],
      printProgressIndex: -1,
      is_printing: false, //是否正在打印

      showPrinterList: false,
      printerList: [],

      showPreviewTicket: false,
      previewDataDic: {},
    };
  },
  methods: {
    handleSelectTab(key) {
      console.log(key);
      this.tabActiveIndex = key;
    },
    getData0() {
      if (this.is_printing) {
        return;
      }
      listWelfareOrder({
        keywords: "",
        status: 1,
        page: 1,
        page_size: 1000,
        start_time: "",
        end_time: "",
      }).then((res) => {
        this.dataArr0 = res.data.data;
        let printData = [];
        for (let i = 0; i < this.dataArr0.length; i++) {
          const element = this.dataArr0[i];
          if (element.print_status == 1) {
            printData.push(element);
          }
        }
        if (printData.length > 0) {
          if (this.printerName.length > 0) {
            // ipcRenderer.send("tts-play", "您有新的订单，请注意查收");
            this.handleSpeak("您有新的订单，请注意查收");
            this.printData = printData;
            this.printTicket();
          } else {
            this.$message.warning("当前有待打印的订单，请先选择打印机");
            this.showPrinterList = true;
            // ipcRenderer.send("tts-play", "当前有待打印的订单，请选择打印机");
            this.handleSpeak("当前有待打印的订单，请选择打印机");
          }
        }
      });
    },
    getData1() {
      listWelfareOrder({
        keywords: "",
        status: 2,
        page: 1,
        page_size: 1000,
        start_time: "",
        end_time: "",
      }).then((res) => {
        this.dataArr1 = res.data.data;
      });
    },
    getData2() {
      listWelfareOrder({
        keywords: "",
        status: 3,
        page: 1,
        page_size: 1000,
        start_time: "",
        end_time: "",
      }).then((res) => {
        this.dataArr2 = res.data.data;
      });
    },
    //预览小票
    previewTicket(index) {
      console.log("预览小票===>>" + index);
      this.previewDataDic = this.dataArr0[index];
      this.showPreviewTicket = true;
    },
    //打印单个小票
    printSingleTicket() {
      if (this.is_printing) {
        this.$message.warning("请等待当前任务队列完成");
        return;
      }
      if (this.printerName.length > 0) {
        this.printData.push(this.previewDataDic);
        this.printTicket();
      } else {
        this.$message.warning("请先选择打印机");
        this.showPrinterList = true;
      }
    },
    //制作完成
    manuComplete(index) {
      console.log("制作完成===>>" + index);
      let item = this.dataArr0[index];
      updateWelfareOrderStatus({
        out_trade_no: item.out_trade_no,
        status: 2,
      }).then((res) => {
        this.dataArr0.splice(index, 1);
        this.getData1();
      });
    },
    //已提货
    delivery(index) {
      console.log("已提货===>>" + index);
      let item = this.dataArr1[index];
      updateWelfareOrderStatus({
        out_trade_no: item.out_trade_no,
        status: 3,
      }).then((res) => {
        this.dataArr1.splice(index, 1);
        this.getData2();
      });
    },
    printTicket() {
      this.printProgressIndex += 1;
      this.is_printing = true;
      // return;
      const webview = document.querySelector("webview");
      // console.log("webview===>>" + webview);
      // webview.openDevTools(); //这个方法可以打开print.html的控制台

      // console.log("准备开始" + JSON.stringify(this.printData));
      // let that = this;
      // console.log("device ===>> " + this.printerName);
      // webview
      //   .print({
      //     //是否是静默打印,true为静默打印，false会弹出打印设置框
      //     silent: true,
      //     printBackground: true,
      //     //打印机的名称，this.print1为在getPrinterList()方法中获取到的打印机名字。
      //     //注意在demo中这是我打印机的设备，在使用本demo时，先去getPrinterList()中找到你使用的打印机
      //     deviceName: this.printerName,
      //   })
      //   .then((res) => {
      //     console.log("webview print success", res);
      //     that.printProgressIndex++;
      //     that.checkPrintProgress();
      //   })
      //   .catch((e) => {
      //     console.log("webview print error", e);
      //     that.printProgressIndex++;
      //     that.checkPrintProgress();
      //   });
      //渲染打印的dom ready
      // webview.addEventListener("dom-ready", () => {
      //   console.log("dom-ready");
      //   //dom-ready---webview加载完成
      //   let dataDic = that.printData[that.printProgressIndex];
      //   //在send时将arr传递过去
      //   webview.send("ping", dataDic); //向webview嵌套的页面响应事件
      // });

      let dataDic = this.printData[this.printProgressIndex];
      webview.send("ping", dataDic);
    },
    checkPrintProgress() {
      if (
        this.printData.length > 0 &&
        this.printProgressIndex >= 0 &&
        this.printProgressIndex < this.printData.length - 1
      ) {
        this.printTicket();
      } else if (
        this.printData.length > 0 &&
        this.printProgressIndex == this.printData.length
      ) {
        //通知后台打印完成的订单
        printOrder({
          out_trade_no: this.printData.map((item) => item.out_trade_no),
        });
        //结束打印
        this.printData = [];
        this.printProgressIndex = -1;
        this.is_printing = false;
      } else {
        //通知后台打印完成的订单
        printOrder({
          out_trade_no: this.printData.map((item) => item.out_trade_no),
        });
        this.printData = [];
        this.printProgressIndex = -1;
        this.is_printing = false;
      }
    },
    choosePrinter(index) {
      this.printerName = this.printerList[index].name;
      this.showPrinterList = false;
      this.getData0();
    },

    getPrinterList() {
      ipcRenderer.send("getPrinterList");
      //监听主线程获取到打印机列表后的回调
      ipcRenderer.once("getPrinterList", (_, data) => {
        console.log("printer list ==>> " + JSON.stringify(data));
        this.printerList = data;
        this.showPrinterList = true;
      });
    },
    // 语音播报的函数
    handleSpeak(text) {
      msg.text = text; // 文字内容: 小朋友，你是否有很多问号
      msg.lang = "zh-CN"; // 使用的语言:中文
      msg.volume = 1; // 声音音量：1
      msg.rate = 1.2; // 语速：1
      msg.pitch = 1.2; // 音高：1
      synth.speak(msg); // 播放
    },
  },
  created() {
    this.getData0();
    this.getData1();
    this.getData2();
    console.log("index created");
    setInterval(() => {
      this.getData0();
    }, 30000);
  },
  mounted() {
    this.getPrinterList();
    this.fullPath = URL.createObjectURL(
      new Blob([raw], {
        type: "text/html",
      })
    );
    const webview = document.querySelector("webview");
    // console.log("webview===>>" + webview);
    // setTimeout(() => {
    //   webview.openDevTools(); //这个方法可以打开print.
    // }, 2000);
    let that = this;
    //打印dom渲染完成通知，准备开始打印
    webview.addEventListener("ipc-message", (event) => {
      // console.log("ipc-message");
      if (event.channel == "pong") {
        // console.log("pong");

        webview
          .print({
            //是否是静默打印,true为静默打印，false会弹出打印设置框
            silent: true,
            printBackground: true,
            //打印机的名称，this.print1为在getPrinterList()方法中获取到的打印机名字。
            //注意在demo中这是我打印机的设备，在使用本demo时，先去getPrinterList()中找到你使用的打印机
            deviceName: that.printerName,
          })
          .then((res) => {
            // console.log("webview print success", res);
            that.checkPrintProgress();
          })
          .catch((e) => {
            // console.log("webview print error", e);
            that.checkPrintProgress();
          });
      }
    });
  },
};
</script>

<style lang="scss" scoped>
body {
  background-color: grey;
}
.scroll-view {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  margin-top: 70px;
  height: auto;
  // overflow-y: scroll;
  padding: 0 5px;
}
.cell-item-con {
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 14px;
  width: 100%;
  height: 90px;
  background-color: white;
  // box-shadow: ;
  margin-bottom: 12px;
  padding: 0 12px;
}
.pick-code {
  font-size: 28px;
  font-weight: 800;
}
.order-info {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 14px;
  font-weight: 400;
  justify-content: center;
  margin-left: 12px;
}
.cell-action-con {
  margin-left: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.ticket-con {
  width: 300px;
  height: auto;
  display: flex;
  flex-direction: column;
}
.product-cell {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 8px;
  margin-top: 8px;
  border-bottom-style: dotted;
  padding-bottom: 8px;
}
.product-info {
  display: flex;
  flex-direction: column;
}
.ticket-total-price {
  font-size: 18px;
  font-weight: 500;
  margin-top: 0px;
}
</style>
