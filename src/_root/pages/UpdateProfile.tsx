import ProfileUploader from "@/components/shared/ProfileUploader";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  useGetUserById,
  useUpdateUser,
} from "@/lib/react-query/queriesAndMutation";
import { userProfileValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { useEffect } from "react";

const UpdateProfile = () => {
  const { id } = useParams();
  const { data: currentUser, isLoading } = useGetUserById(id || "");
  const { toast } = useToast();
  const navigate = useNavigate();

  const { mutateAsync: updateUser, isPending: isUpdatingUser } =
    useUpdateUser();

  const form = useForm<z.infer<typeof userProfileValidation>>({
    resolver: zodResolver(userProfileValidation),
    defaultValues: {
      name: currentUser?.name,
      username: currentUser?.username,
      file: [],
      email: currentUser?.email,
      bio: currentUser?.bio || "",
    },
  });

  useEffect(() => {
    if (currentUser && !form.getValues("name")) {
      form.setValue("name", currentUser.name);
      form.setValue("bio", currentUser.bio);
      form.setValue("username", currentUser.username);
      form.setValue("email", currentUser.email);
    }
  }, [currentUser, form]);

  if (isLoading || !currentUser) return <Loader option="full" />;

  async function onSubmit(values: z.infer<typeof userProfileValidation>) {
    if (!currentUser) return;
    const updatedUser = await updateUser({
      userId: currentUser.$id,
      imageId: currentUser.imageId,
      imageUrl: currentUser.imageurl,
      ...values,
    });

    if (!updatedUser)
      return toast({
        title: "Update user data failed. Please try again.",
      });
    return navigate(`/profile/${id}`);
  }

  return (
    <div className="custom-scrollbar flex flex-1 flex-col items-center gap-16 overflow-auto px-5 py-9 md:p-14">
      <div className="flex w-full max-w-5xl items-center gap-3 text-3xl font-bold">
        <img src="/assets/icons/edit.svg" alt="edit" className="invert-white" />
        <h1>Edit Profile</h1>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full max-w-5xl flex-col gap-9"
        >
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ProfileUploader
                    fieldChange={field.onChange}
                    mediaUrl={currentUser?.imageUrl}
                  />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Username</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="shad-input"
                    {...field}
                    disabled
                  />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Email</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="shad-input"
                    {...field}
                    disabled
                  />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Bio</FormLabel>
                <FormControl>
                  <Textarea
                    className="shad-textarea custom-scrollbar "
                    {...field}
                  />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-end gap-4">
            <Button type="button" className="shad-button_dark_4">
              Cancel
            </Button>
            <Button
              type="submit"
              className="shad-button_primary whitespace-nowrap"
              disabled={isUpdatingUser}
            >
              {isUpdatingUser ? "updating..." : "update"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UpdateProfile;
