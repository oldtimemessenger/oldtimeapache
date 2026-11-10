import { strict as assert } from "node:assert";
import { test } from "node:test";
import { postReposts } from "../src/cloudflare/post-participants";

const postId="b2f35ca8-dc11-4c3c-bffc-06f65981b51a";
const viewerId="a9c8bf6d-3a25-4c1e-9bb8-1dc97e2ba20f";

function database({post=true,total=2,people=[]}:{post?:boolean;total?:number;people?:unknown[]}={}) {
  const statements:{sql:string;params:unknown[]}[]=[];
  return {
    statements,
    prepare(sql:string) {
      return {bind(...params:unknown[]) {
        statements.push({sql,params});
        return {
          async all() {
            if(sql.includes("FROM posts p"))return {results:post?[{id:postId}]:[]};
            if(sql.includes("FROM post_reposts r JOIN users u"))return {results:people};
            return {results:[]};
          },
          async first() { return sql.includes("count(*) AS total")?{total}:null; },
        };
      }};
    },
  } as any;
}

test("post reposters are paged, block-filtered, and respect private profile visibility",async()=>{
  const db=database({total:2,people:[
    {id:viewerId,username:"friend_a",display_name:"Friend A",created_at:12,data:JSON.stringify({profile:{avatar:"avatar.webp"}})},
  ]});
  const response=await postReposts(
    new Request(`https://example.test/api/posts/${postId}/reposts?limit=1&offset=0`),
    db,viewerId,postId,
  );
  const body=await response.json() as {reposts:Array<{id:string;displayName:string;avatar:string}>;total:number;hasMore:boolean;nextOffset:number};
  assert.equal(response.status,200);
  assert.equal(body.reposts[0]?.id,viewerId);
  assert.equal(body.reposts[0]?.displayName,"Friend A");
  assert.equal(body.reposts[0]?.avatar,"avatar.webp");
  assert.equal(body.total,2);
  assert.equal(body.hasMore,true);
  assert.equal(body.nextOffset,1);
  const listQuery=db.statements.find((statement:{sql:string})=>
    statement.sql.includes("FROM post_reposts r JOIN users u")&&statement.sql.includes("LIMIT ? OFFSET ?"));
  assert.ok(listQuery);
  assert.match(listQuery.sql,/u\.is_virtual=0/);
  assert.match(listQuery.sql,/u\.is_private=0 OR EXISTS/);
  assert.match(listQuery.sql,/FROM account_blocks/);
  assert.equal(listQuery.params.at(-2),1);
  assert.equal(listQuery.params.at(-1),0);
});

test("post reposters are unavailable when the viewer cannot access the post",async()=>{
  const db=database({post:false});
  await assert.rejects(
    postReposts(new Request(`https://example.test/api/posts/${postId}/reposts`),db,viewerId,postId),
    /Post not found/,
  );
});

test("post reposter pagination rejects oversized pages",async()=>{
  const db=database();
  await assert.rejects(
    postReposts(new Request(`https://example.test/api/posts/${postId}/reposts?limit=51`),db,viewerId,postId),
    /Use a page size/,
  );
});
