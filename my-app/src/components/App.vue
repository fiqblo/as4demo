<!-- This example requires Tailwind CSS v2.0+ -->
<template>
  <div class="flex flex-col">
    <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Id
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">

              <tr v-for="post in posts" :key="post.userId">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <img class="h-10 w-10 rounded-full" src="../assets/img/user1.png" alt="" />
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ currentUser.username }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ post.content }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {{ currentUser.id }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ post.id }}
                </td>
              </tr>
              <tr v-for="post in secondposts" :key="post.userId">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <img class="h-10 w-10 rounded-full" src="../assets/img/user2.png" alt="" />
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ currentUser2.username }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ post.content }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {{ currentUser2.id }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ post.id }}
                </td>
              </tr>

              <tr v-for="post in thirdposts" :key="post.userId">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <img class="h-10 w-10 rounded-full" src="../assets/img/user1.png" alt="" />
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ currentUser3.username }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ post.content }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {{ currentUser3.id }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ post.id }}
                </td>
              </tr>
              <tr>
                <th>
                  <div>
                    <button @click="addPost()">Add Post</button>
                    <input v-model="newPostContent" />
                  </div>
                </th>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import gql from "graphql-tag";

const CURRENT_USER = gql`
  query {
    currentUser {
      id
      username
    }
  }
`;

const SECOND_USER = gql`
  query {
    currentUser2 {
      id
      username
    }
  }
`;

const THIRD_USER = gql`
  query {
    currentUser3 {
      id
      username
    }
  }
`;

const POSTS_BY_USER = gql`
  query($userId: String!) {
    postsByUser(userId: $userId) {
      id
      content
    }
  }
`;

const ADD_POST = gql`
  mutation($content: String!) {
    addPost(content: $content) {
      id
      content
    }
  }
`;

function updateAddPost(cache, result) {
  let newPost = result.data.addPost;

  console.log(newPost.id);

  let cacheId = {
    query: POSTS_BY_USER,
    variables: { userId: this.currentUser.id }
  };

  const data = cache.readQuery(cacheId);
  const newData = [...data.postsByUser, newPost];

  cache.writeQuery({
    ...cacheId,
    data: { postsByUser: newData }
  });
}

export default {
  name: "app",
  data: function() {
    return {
      currentUser: { username: "user" },
      currentUser2: { username: "user" },
      currentUser3: { username: "user" },
      posts: [],
      newPostContent: ""
    };
  },

  methods: {
    addPost() {
      this.$apollo.mutate({
        mutation: ADD_POST,
        variables: { content: this.newPostContent },
        update: updateAddPost.bind(this),

        // NEW
        optimisticResponse: {
          __typename: "Mutation",
          addPost: {
            __typename: "Post",
            id: "xyz-?",
            content: this.newPostContent,
            userId: this.currentUser.id
          }
        }
      });

      this.newPostContent = "";
    }
  },

  apollo: {
    currentUser: CURRENT_USER,
    currentUser2: SECOND_USER,
    currentUser3: THIRD_USER,
    posts: {
      query: POSTS_BY_USER,
      variables() {
        return { userId: String(this.currentUser.id) };
      },
      update(data) {
        return data.postsByUser;
      }
    },
    secondposts: {
      query: POSTS_BY_USER,
      variables() {
        return { userId: String(this.currentUser2.id) };
      },
      update(data) {
        return data.postsByUser;
      }
    },
    thirdposts: {
      query: POSTS_BY_USER,
      variables() {
        return { userId: String(this.currentUser3.id) };
      },
      update(data) {
        return data.postsByUser;
      }
    }
  }
};
</script>
