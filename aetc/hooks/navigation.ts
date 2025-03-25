"use client";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

export const useNavigation = () => {
  const router = useRouter();
  const params = useParams();

  return {
    navigateTo: (link: string) => router.push(link),
    refresh: () => router.refresh(),
    navigateBack: () => router.back(),
    navigateBackToProfile: () => router.push(`/patient/${params.id}/profile`),
  };
};

export const useParameters = () => {
  const params = useParams();

  return { params };
};
