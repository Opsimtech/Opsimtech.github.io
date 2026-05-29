# Decap CMS Setup Guide

This document describes the Decap CMS setup for the Opsimtech GitHub Pages site.

## Overview

Decap CMS is configured at `/admin/` with GitHub as the backend. Because the site is hosted on GitHub Pages (not a server), a Cloudflare Worker acts as the OAuth proxy for GitHub authentication.

## Files

| File | Purpose |
|------|---------|
| `admin/index.html` | Decap CMS entry point — loads the CMS UI |
| `admin/config.yml` | Decap CMS configuration (backend, media, collections) |

## How It Works

1. User visits `https://opsimtech.github.io/admin/`
2. Decap CMS redirects to GitHub OAuth via the Cloudflare Worker at `base_url`
3. Worker completes the OAuth handshake and returns a token to the CMS
4. User can create/edit content which is committed directly to the `main` branch

## Cloudflare Worker OAuth Bridge Setup

### 1. Create a GitHub OAuth App

- Go to GitHub → Settings → Developer settings → OAuth Apps → New OAuth App
- Application name: `Opsimtech Decap CMS`
- Homepage URL: `https://opsimtech.github.io`
- Authorization callback URL: `https://<your-worker-subdomain>.workers.dev/callback`
- Save the **Client ID** and **Client Secret**

### 2. Deploy the Cloudflare Worker

Use the `cloudflare-workers-github-oauth-provider` worker:

```js
const GITHUB_ID = "<YOUR_GITHUB_CLIENT_ID>";
const GITHUB_SECRET = "<YOUR_GITHUB_CLIENT_SECRET>";
const ORIGIN = "https://opsimtech.github.io";

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
  });

  async function handleRequest(request) {
    const url = new URL(request.url);

      if (url.pathname === "/auth") {
          return Response.redirect(
                `https://github.com/login/oauth/authorize?client_id=${GITHUB_ID}&scope=repo,user`,
                      302
                          );
                            }

                              if (url.pathname === "/callback") {
                                  const code = url.searchParams.get("code");
                                      const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
                                            method: "POST",
                                                  headers: { "Content-Type": "application/json", "Accept": "application/json" },
                                                        body: JSON.stringify({ client_id: GITHUB_ID, client_secret: GITHUB_SECRET, code })
                                                            });
                                                                const { access_token } = await tokenRes.json();
                                                                    const content = `<script>
                                                                          (function() {
                                                                                  window.opener.postMessage(
                                                                                            'authorization:github:success:{"token":"${access_token}","provider":"github"}',
                                                                                                      '${ORIGIN}'
                                                                                                              );
                                                                                                                    })();
                                                                                                                        </script>`;
                                                                                                                            return new Response(content, { headers: { "Content-Type": "text/html" } });
                                                                                                                              }
                                                                                                                              
                                                                                                                                return new Response("Not found", { status: 404 });
                                                                                                                                }
                                                                                                                                ```
                                                                                                                                
                                                                                                                                ### 3. Update admin/config.yml
                                                                                                                                
                                                                                                                                Replace `WORKER_URL_PLACEHOLDER` with your deployed worker URL:
                                                                                                                                
                                                                                                                                ```yaml
                                                                                                                                base_url: https://<your-worker-subdomain>.workers.dev
                                                                                                                                ```
                                                                                                                                
                                                                                                                                ### 4. Update the GitHub OAuth App Callback URL
                                                                                                                                
                                                                                                                                Set the callback URL to match your deployed worker:
                                                                                                                                `https://<your-worker-subdomain>.workers.dev/callback`
                                                                                                                                
                                                                                                                                ## Accessing the CMS
                                                                                                                                
                                                                                                                                Once configured: `https://opsimtech.github.io/admin/`
                                                                                                                                
