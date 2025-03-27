<template>
  <div>
    <div>  Bot昵称：{{ bot_name }} </div>
    <div>  Bot战力：{{ bot_rting }} </div>
  </div>
 
  <router-view/>
</template>
<script>
import $ from 'jquery'
import { ref} from 'vue';

  export default {
    name:"APP",
    setup: ()=> {
      let bot_name = ref("");
      let bot_rting = ref("");
      
      $.ajax({
        url:"http://127.0.0.1:8081/pk/getBotInfo/",
        type:"get",
        success: resp => {
          bot_name.value = resp.name;
          bot_rting.value = resp.rating;
        }
      });

      return {
        bot_name,
        bot_rting  
      }

    }
  }
</script>

<style>
body{
  background-image: url("@/assets/background.jpg");
  background-size: cover;
}

</style>
