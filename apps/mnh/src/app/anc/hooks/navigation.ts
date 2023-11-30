import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

export const useNavigation = () => {
  const router = useRouter();

  return { navigateTo: (link: string) => router.push(link) };
};

export const useParameters = () => {
  const params = useParams();

  return { params };
};
