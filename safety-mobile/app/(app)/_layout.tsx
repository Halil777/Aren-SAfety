import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/theme";
import { useAuth } from "../../contexts/auth";
import { useLanguage } from "../../contexts/language";

const tabTitles: Record<
  "en" | "tr" | "ru",
  { home: string; tasks: string; create: string; profile: string }
> = {
  en: { home: "Home", tasks: "Tasks", create: "Create", profile: "Profile" },
  tr: { home: "Ana sayfa", tasks: "G\u00f6revler", create: "Olustur", profile: "Profil" },
  ru: { home: "Home", tasks: "Tasks", create: "Create", profile: "Profile" },
};

export default function AppTabs() {
  const { colors } = useTheme();
  const { role } = useAuth();
  const { language } = useLanguage();
  const showCreate = role === "SUPERVISOR";
  const titles = tabTitles[language] || tabTitles.en;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.subtle,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: titles.home,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="warning-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="tasks"
        options={{
          title: titles.tasks,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="create-observation"
        options={{
          title: titles.create,
          href: showCreate ? undefined : null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: titles.profile,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="observations"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="observation/[id]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="create-task"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
