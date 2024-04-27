import { ID, Query } from "appwrite";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";
import { toast } from "@/components/ui/use-toast";

// ******************* User *************************
export async function createUserAccount(user: INewUser) {
  // Creating a user in auth and in database
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name,
    );
    if (!newAccount) throw Error;
    const avatarUrl = avatars.getInitials(user.name); // create initial avatar depending on the name u pass in the argument
    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      email: newAccount.email,
      name: newAccount.name,
      username: user.username,
      imageUrl: avatarUrl,
    });
    return newUser;
  } catch (error) {
    console.error(error);
  }
}
export async function saveUserToDB(user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: URL;
  username?: string;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      ID.unique(),
      user,
    );
    return newUser;
  } catch (error) {
    console.error(error);
  }
}
export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailSession(user.email, user.password);
    return session;
  } catch (error) {
    toast({
      title: "Email or password incorrect",
    });
    console.error(error);
  }
}
export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;
    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("accountId", currentAccount.$id)],
    );
    if (!currentUser) throw Error;
    return currentUser.documents[0];
  } catch (error) {
    console.error(error);
  }
}
export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    console.error(error);
  }
}

export async function createPost(post: INewPost) {
  try {
    const uploadedFile = await uploadFile(post.file[0]);
    if (!uploadedFile) throw Error;

    const imageUrl = getFilePreview(uploadedFile.$id);
    if (!imageUrl) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    const tags = post.tags?.replace?.(/ /g, "").split(",");
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags,
      },
    );
    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }
    return newPost;
  } catch (error) {
    console.error(error);
  }
}
// ******************* Image File *************************
export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file,
    );
    return uploadedFile;
  } catch (error) {
    console.error(error);
  }
}
export function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      "top",
      100,
    );
    if (!fileUrl) throw Error;
    return fileUrl;
  } catch (error) {
    console.error(error);
  }
}
export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);

    return { status: "ok" };
  } catch (error) {
    console.error(error);
  }
}
// ******************* Posts *************************

export async function getRecentPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(20)],
    );
    if (!posts) throw Error;
    return posts;
  } catch (error) {
    console.error(error);
  }
}
export async function likePost(postId: string, likes: string[]) {
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId,
      {
        likes,
      },
    );
    if (!updatedPost) throw Error;
    return updatedPost;
  } catch (error) {
    console.error(error);
  }
}
export async function savePost(postId: string, userId: string) {
  try {
    const updatedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      },
    );
    if (!updatedPost) throw Error;
    return updatedPost;
  } catch (error) {
    console.error(error);
  }
}
export async function deleteSavedPost(savedRecordID: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordID,
    );
    if (!statusCode) throw Error;
    return { status: "ok" };
  } catch (error) {
    console.error(error);
  }
}
export async function getPostById(postId: string) {
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId,
    );
    return post;
  } catch (error) {
    console.error(error);
  }
}
export async function updatePost(post: IUpdatePost) {
  const hasFileToUpdate = post.file.length > 0;

  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    };
    let uploadedFile;
    if (hasFileToUpdate) {
      uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) throw Error;

      const imageUrl = getFilePreview(uploadedFile.$id);
      if (!imageUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }
      image = { ...image, imageUrl, imageId: uploadedFile.$id };
    }
    const tags = post.tags?.replace?.(/ /g, "").split(",");

    const updateCurrentPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      post.postId,
      {
        caption: post.caption,
        ...image,
        location: post.location,
        tags,
      },
    );
    if (!updateCurrentPost && uploadedFile) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }
    if (hasFileToUpdate) {
      await deleteFile(post.imageId);
    }
    return updateCurrentPost;
  } catch (error) {
    console.error(error);
  }
}
export async function deletePost(postId: string, imageId: string) {
  if (!postId || !imageId) throw Error;
  try {
    const deleteImage = await deleteFile(imageId);
    if (!deleteImage) throw Error;
    const deleteCurrPost = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId,
    );
    if (!deleteCurrPost) throw Error;
    return { status: "ok" };
  } catch (error) {
    console.error(error);
  }
}
export async function getInfinitePosts({ pageParam }: { pageParam: string }) {
  const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(9)];
  console.log(pageParam);
  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam));
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      queries,
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}
export async function searchPosts(searchTerm: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      [Query.search("caption", searchTerm)],
    );
    if (!posts) throw Error;
    return posts;
  } catch (error) {
    console.error(error);
  }
}
export async function getUsers(limit?: number) {
  const queries = [Query.orderDesc("$createdAt")];

  if (limit) {
    queries.push(Query.limit(limit));
  }
  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      queries,
    );
    if (!users) throw Error;
    return users;
  } catch (error) {
    console.error(error);
  }
}
export async function getUserById(id: string) {
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      id,
    );
    if (!user) throw Error;
    return user;
  } catch (error) {
    console.error(error);
  }
}
export async function updateUser(userData: IUpdateUser) {
  const isUserDataHasFile = userData.file.length > 0;
  try {
    let image = {
      imageId: userData.imageId,
      imageUrl: userData.imageUrl,
    };
    let uploadedImage;
    if (isUserDataHasFile) {
      uploadedImage = await uploadFile(userData.file[0]);
      if (!uploadedImage) throw Error;
      let imageUrl = getFilePreview(uploadedImage.$id);
      if (!imageUrl) {
        await deleteFile(uploadedImage.$id);
        throw Error;
      }
      image = { imageId: uploadedImage.$id, imageUrl };
    }
    const user = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      userData.userId,
      { ...image, name: userData.name, bio: userData.bio },
    );
    console.log(user);
    if (!user && uploadedImage) {
      await deleteFile(uploadedImage?.$id);
      throw Error;
    }
    if (isUserDataHasFile && userData.imageId) {
      await deleteFile(userData.imageId);
    }
    return user;
  } catch (error) {
    console.error(error);
  }
}
