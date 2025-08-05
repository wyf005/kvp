export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === 'GET') {
    const links = await getLinks(env);
    return new Response(JSON.stringify(links), {
      headers: { 'Content-Type': 'application/json' },
    });
  } else if (request.method === 'POST') {
    const { password, link } = await request.json();
    
    // 验证密码
    if (password !== env.EDIT_PASSWORD) {
      return new Response('Unauthorized: Incorrect password', { status: 401 });
    }
    
    await saveLink(env, link);
    return new Response('Link saved', { status: 200 });
  }

  return new Response('Not found', { status: 404 });
}

async function getLinks(env) {
  const storedLinks = await env.LINKS_KV.get('all_links');
  return storedLinks ? JSON.parse(storedLinks) : getDefaultLinks();
}

async function saveLink(env, newLink) {
  const links = await getLinks(env);
  const index = links.findIndex(link => link.url === newLink.url);
  if (index > -1) {
    links[index] = newLink;
  } else {
    links.push(newLink);
  }
  await env.LINKS_KV.put('all_links', JSON.stringify(links));
}

function getDefaultLinks() {
  return [
    // 常用
    { category: 'ai-search', title: 'Google', url: 'https://www.google.com', icon: 'fab fa-google' },

    // 影视
    { category: 'social', title: 'GitHub', url: 'https://github.com/', icon: 'fab fa-github' },

    // 在线工具
    { category: 'tools', title: 'improvmx', url: 'https://improvmx.com/', icon: 'fas fa-mail-bulk' },

    // 软件
    { category: 'tech-news', title: 'TechCrunch', url: 'https://www.techcrunch.com', icon: 'fas fa-newspaper' },
    
    // 设计
    { category: 'cloud-storage', title: 'Dropbox', url: 'https://www.dropbox.com', icon: 'fas fa-cloud' },
    
    // 后台
    { category: 'email', title: 'Gmail', url: 'https://mail.google.com', icon: 'fas fa-envelope' },

  ];
}
