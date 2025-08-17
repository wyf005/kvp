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
    // 软件

    // 其他


  ];
}
