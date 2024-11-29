
const newHeaders = new Headers();
newHeaders.set("Access-Control-Allow-Origin", "*");
newHeaders.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
newHeaders.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
newHeaders.set("Content-Type", "application/json");

export default {
  async fetch(request, env) {
    // 解析请求 URL
    const url = new URL(request.url);
    const queryParams = url.searchParams;

    const topic = queryParams.get("t"); 
    const ids = queryParams.get("ids"); 

    // 获取评论列表（带有基本信息）
    if(url.pathname == '/getCom'){
      return getComment(topic)
    }
    // 根据评论id获取点赞列表
    if(url.pathname == '/getLike'){
      return getLike(topic)
    }
    //根据评论id获取数据（当评论几百条的时候，抽奖抽id，根据抽到的id查询是谁评论的）
    if(url.pathname == '/getComUser'){
      return getComUser(topic,ids)
    }
  },
};
// 评论列表
async function getComment(topic) { 
  const userApiUrl = `https://linux.do/t/${topic}/1.json`;

  try {
    const response = await fetch(userApiUrl);
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers:newHeaders,
    });
  } catch (error) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}

async function getLike(topicId){
  const userApiUrl = `https://linux.do/discourse-reactions/posts/${topicId}/reactions-users.json`;
  try {
    const response = await fetch(userApiUrl);
    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers:newHeaders,
    });
  } catch (error) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}

async function getComUser(topicId,ids){
  const baseUrl = `https://linux.do/t/${topicId}/posts.json`;
  const params = new URLSearchParams();
  let postIds = ids.split(',')
  postIds.forEach((id) => params.append("post_ids[]", id));
  params.append("include_suggested", "true");

  const userApiUrl = `${baseUrl}?${params.toString()}`;
  try {
    const response = await fetch(userApiUrl);
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers:newHeaders,
    });
  } catch (error) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}
