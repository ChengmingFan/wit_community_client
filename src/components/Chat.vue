<template>
  <section style="margin-top: -20px;">
    <el-divider/>
    <el-container style="height: 500px">
      <div class="chat-container" ref="chatContainer">
        <el-scrollbar ref="myScrollbar" style="width: 100%;height: 100%">
          <message :messages="messages"></message>
        </el-scrollbar>
      </div>
    </el-container>
    <div slot="footer" class="dialog-footer">
      <el-input type="text" placeholder="Type here..." v-on:keyup.enter.native="sendMessage"
                v-model="content"></el-input>
    </div>
  </section>
</template>

<script>
import Message from './Message'
import MessageService from '../services/MessageService'

export default {
  name: 'Chat',
  data () {
    return {
      content: '',
      chatMessages: [],
      emojiPanel: false,
      currentRef: {},
      loading: false,
      totalChatHeight: 0,
      ref: ''
    }
  },
  props: [
    'id'
  ],
  created () {
    this.loadChat()
  },
  components: {
    'message': Message
  },
  computed: {
    messages () {
      return this.chatMessages
    },
    user () {
      return this.$store.state.user
    },
    receiver () {
      return this.$store.state.receiver
    }
  },
  watch: {
    receiver: function (val, oldval) {
      this.loadChat()
    }
  },
  methods: {
    loadChat () {
      if (this.user._id === null || this.receiver === null) {
      } else {
        MessageService.getMessage({
          senderId: this.user._id,
          receiverId: this.receiver._id
        })
          .then(res => {
            if (res.data.code === 0) {
              this.$message.error({
                message: 'error',
                center: true
              })
            } else {
              this.chatMessages = res.data.message
              this.$nextTick(() => {
                this.scrollDown()
              })
            }
          })
      }
    },
    async sendMessage () {
      if (this.content !== '') {
        let formatContent = this.content
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;')
        const response = await MessageService.createMessage({
          senderId: this.user._id,
          senderName: this.user.username,
          receiverId: this.receiver._id,
          receiverName: this.receiver.username,
          content: formatContent
        })
        if (response.data.code === 0) {
          this.error = response.data.msg
        } else {
          this.chatMessages.push({
            senderName: this.user.username,
            content: formatContent
          })
          this.$nextTick(() => {
            this.scrollDown()
          })
        }
        this.content = ''
      }
    },
    async scrollDown () {
      this.$refs['myScrollbar'].$refs['wrap'].scrollTop = this.$refs['myScrollbar'].$refs['wrap'].scrollHeight
    }
  }
}
</script>

<style>
  .chat-container {
    margin-left: -15px;
    width: 110%;
    box-sizing: border-box;
    /*height: calc(100vh - 9.5rem);*/
    height: 500px;
    overflow-y: auto;
    /*padding: 10px;*/
    /*background-color: #f2f2f2;*/
  }

  .message {
    margin-bottom: 3px;
  }

  .message.own {
    text-align: right;
    margin-right: 20px;
  }

  .message.own .content {
    background-color: lightgreen;
  }

  .chat-container .username {
    font-size: 18px;
    font-weight: bold;
  }

  .chat-container .content {
    padding: 8px;
    background-color: #f6f6f6;
    border-radius: 10px;
    display: inline-block;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 2px 1px -1px rgba(0, 0, 0, 0.12);
    max-width: 50%;
    word-wrap: break-word;
  }

  @media (max-width: 480px) {
    .chat-container .content {
      max-width: 60%;
    }
  }
</style>

<style scoped>
  .dialog-footer {
    width: 103%;
    display: flex;
    margin-left: -15px;
    margin-top: 5px;
    margin-bottom: -20px;
  }
</style>
