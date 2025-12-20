import { useMemo, useState } from "react";
import { Alert, Platform, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import { Screen } from "../../components/layout/Screen";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Select } from "../../components/ui/Select";
import { useTheme } from "../../contexts/theme";
import { useAuth } from "../../contexts/auth";
import {
  useCategoriesQuery,
  useCreateTaskMutation,
  useDepartmentsQuery,
  useLocationsQuery,
  useProjectsQuery,
  useSubcategoriesQuery,
  useSupervisorsQuery,
} from "../../query/hooks";

type Attachment = {
  uri: string;
  type: "IMAGE" | "VIDEO" | "FILE";
  base64?: string;
  mime?: string;
};

const ensureDataUri = (value: string, mime: string) =>
  value.startsWith("data:") ? value : `data:${mime};base64,${value}`;

export default function CreateTaskScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { token, user, role } = useAuth();

  const [formState, setFormState] = useState({
    projectId: "",
    departmentId: "",
    locationId: "",
    supervisorId: "",
    categoryId: "",
    subcategoryId: "",
    description: "",
  });

  const projectsQuery = useProjectsQuery({ token, scope: user?.id });
  const departmentsQuery = useDepartmentsQuery({ token, scope: user?.id });
  const locationsQuery = useLocationsQuery({ token, scope: user?.id });
  const supervisorsQuery = useSupervisorsQuery({ token, scope: user?.id });
  const categoriesQuery = useCategoriesQuery({ token, scope: user?.id, type: "task" });
  const subcategoriesQuery = useSubcategoriesQuery({
    token,
    scope: user?.id,
    categoryId: formState.categoryId || undefined,
    type: "task",
  });

  const createTaskMutation = useCreateTaskMutation({ token, scope: user?.id });

  const loading =
    projectsQuery.isPending ||
    departmentsQuery.isPending ||
    supervisorsQuery.isPending ||
    categoriesQuery.isPending ||
    locationsQuery.isPending;

  const [deadline, setDeadline] = useState(() => {
    const d = new Date();
    d.setHours(d.getHours() + 24);
    return d;
  });
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const selectableSupervisors = useMemo(
    () => (supervisorsQuery.data ?? []).filter((s) => s.id !== user?.id),
    [supervisorsQuery.data, user?.id]
  );

  const availableLocations = useMemo(
    () =>
      (locationsQuery.data ?? []).filter(
        (l) => !formState.projectId || l.projectId === formState.projectId
      ),
    [locationsQuery.data, formState.projectId]
  );

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permission needed", "Allow media access to attach files.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      base64: true,
    });
    if (result.canceled) return;
    const asset = result.assets?.[0];
    if (!asset?.uri) return;
    const base64 = asset.base64 ?? undefined;
    if (!base64) return;
    setAttachments((prev) => [
      ...prev,
      {
        uri: asset.uri,
        type: "IMAGE",
        base64,
        mime: asset.mimeType ?? "image/jpeg",
      },
    ]);
  };

  const pickVideo = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permission needed", "Allow media access to attach files.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 0.7,
    });
    if (result.canceled) return;
    const asset = result.assets?.[0];
    if (!asset?.uri) return;
    try {
      const base64 = await FileSystem.readAsStringAsync(asset.uri, { encoding: "base64" });
      setAttachments((prev) => [
        ...prev,
        {
          uri: asset.uri,
          type: "VIDEO",
          base64,
          mime: asset.mimeType ?? "video/mp4",
        },
      ]);
    } catch (err) {
      console.warn("pickVideo failed:", err);
      Alert.alert("Error", "Could not read video");
    }
  };

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        multiple: false,
        type: "*/*",
      });
      if (result.canceled) return;
      const asset = result.assets?.[0];
      if (!asset?.uri) return;
      const base64 = await FileSystem.readAsStringAsync(asset.uri, { encoding: "base64" });
      setAttachments((prev) => [
        ...prev,
        {
          uri: asset.uri,
          type: "FILE",
          base64,
          mime: asset.mimeType ?? "application/octet-stream",
        },
      ]);
    } catch (err) {
      console.warn("pickFile failed:", err);
      Alert.alert("Error", "Could not read file");
    }
  };

  const submit = async () => {
    if (!token || !user) {
      Alert.alert("Error", "Please log in again");
      return;
    }
    if (role !== "SUPERVISOR") {
      Alert.alert("Error", "Only supervisors can create tasks.");
      return;
    }
    if (!formState.projectId || !formState.departmentId || !formState.categoryId || !formState.supervisorId) {
      Alert.alert("Error", "Fill in the required fields");
      return;
    }
    if (!formState.description.trim()) {
      Alert.alert("Error", "Enter a description");
      return;
    }

    const media = attachments.flatMap((att) => {
      if (!att.base64) return [];
      return [
        {
          url: ensureDataUri(att.base64, att.mime ?? "application/octet-stream"),
          type: att.type,
          isCorrective: false,
        },
      ];
    });

    try {
      await createTaskMutation.mutateAsync({
        createdByUserId: user.id,
        projectId: formState.projectId,
        departmentId: formState.departmentId,
        categoryId: formState.categoryId,
        ...(formState.subcategoryId ? { subcategoryId: formState.subcategoryId } : {}),
        supervisorId: formState.supervisorId,
        description: formState.description,
        deadline: deadline.toISOString(),
        status: "NEW",
        ...(media.length ? { media } : {}),
      });
      Alert.alert("Done", "Task created");
      router.push("/(app)/tasks");
    } catch (err) {
      console.error("createTask failed:", err);
      Alert.alert("Creation failed", err instanceof Error ? err.message : "Could not create task");
    }
  };

  if (loading) {
    return (
      <Screen>
        <Text style={{ color: colors.muted }}>Loading...</Text>
      </Screen>
    );
  }

  return (
    <Screen scrollable>
      <View style={{ gap: 14 }}>
        <View style={{ gap: 2 }}>
          <Text style={{ color: colors.text, fontSize: 22, fontWeight: "800" }}>Create task</Text>
          <Text style={{ color: colors.muted }}>Send a new task to another supervisor</Text>
        </View>

        <Card style={{ gap: 12 }}>
          <Select
            label="Project *"
            value={formState.projectId}
            placeholder="Select project"
            options={(projectsQuery.data ?? []).map((p) => ({ value: p.id, label: p.name }))}
            onValueChange={(v) =>
              setFormState((s) => ({
                ...s,
                projectId: v,
                departmentId: "",
                locationId: "",
                categoryId: "",
                subcategoryId: "",
              }))
            }
          />

          <Select
            label="Department *"
            value={formState.departmentId}
            placeholder="Select department"
            options={(departmentsQuery.data ?? []).map((d) => ({ value: d.id, label: d.name }))}
            onValueChange={(v) => setFormState((s) => ({ ...s, departmentId: v }))}
          />

          <Select
            label="Location (optional)"
            value={formState.locationId}
            placeholder={formState.projectId ? "Select location" : "Select project first"}
            options={availableLocations.map((l) => ({ value: l.id, label: l.name }))}
            onValueChange={(v) => setFormState((s) => ({ ...s, locationId: v }))}
            disabled={!formState.projectId}
          />

          <Select
            label="Supervisor *"
            value={formState.supervisorId}
            placeholder="Select supervisor"
            options={selectableSupervisors.map((s) => ({ value: s.id, label: s.fullName }))}
            onValueChange={(v) => setFormState((s) => ({ ...s, supervisorId: v }))}
          />

          <Select
            label="Category *"
            value={formState.categoryId}
            placeholder="Select category"
            options={(categoriesQuery.data ?? []).map((c) => ({ value: c.id, label: c.name }))}
            onValueChange={(v) => setFormState((s) => ({ ...s, categoryId: v, subcategoryId: "" }))}
          />

          <Select
            label="Subcategory (optional)"
            value={formState.subcategoryId}
            placeholder={formState.categoryId ? "Select subcategory" : "Choose a category first"}
            options={(subcategoriesQuery.data ?? []).map((sc) => ({ value: sc.id, label: sc.name }))}
            onValueChange={(v) => setFormState((s) => ({ ...s, subcategoryId: v }))}
            disabled={!formState.categoryId}
          />
        </Card>

        <Card style={{ gap: 12 }}>
          <Input
            label="Description *"
            value={formState.description}
            onChangeText={(v) => setFormState((s) => ({ ...s, description: v }))}
            placeholder="Describe the task"
            multiline
            style={{ minHeight: 120, textAlignVertical: "top" as any }}
          />
        </Card>

        <Card style={{ gap: 12 }}>
          <Text style={{ color: colors.text, fontWeight: "800", fontSize: 16 }}>Attachments</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            <PickButton label="Image" icon="image-outline" onPress={pickImage} />
            <PickButton label="Video" icon="videocam-outline" onPress={pickVideo} />
            <PickButton label="File" icon="document-outline" onPress={pickFile} />
          </View>

          {attachments.length ? (
            <View style={{ gap: 8 }}>
              {attachments.map((att, idx) => (
                <View
                  key={`${att.uri}-${idx}`}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: 10,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: colors.subtle,
                  }}
                >
                  <Text style={{ color: colors.text, flex: 1 }}>
                    {att.type} {idx + 1}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setAttachments((prev) => prev.filter((_, i) => i !== idx))}
                    hitSlop={8}
                  >
                    <Ionicons name="trash-outline" size={18} color={colors.danger ?? colors.accent} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <Text style={{ color: colors.muted }}>No attachments</Text>
          )}
        </Card>

        <Card style={{ gap: 10 }}>
          <Text style={{ color: colors.text, fontWeight: "800", fontSize: 16 }}>Deadline</Text>
          <View style={{ flexDirection: "row", gap: 10, flexWrap: "wrap" }}>
            <Button
              label={`Date: ${deadline.toISOString().slice(0, 10)}`}
              onPress={() => setShowDate(true)}
              variant="ghost"
              borderColor={colors.subtle}
              textColor={colors.text}
            />
            <Button
              label={`Time: ${deadline.toTimeString().slice(0, 5)}`}
              onPress={() => setShowTime(true)}
              variant="ghost"
              borderColor={colors.subtle}
              textColor={colors.text}
            />
          </View>

          {showDate ? (
            <DateTimePicker
              value={deadline}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(_, selected) => {
                setShowDate(false);
                if (!selected) return;
                const next = new Date(deadline);
                next.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate());
                setDeadline(next);
              }}
            />
          ) : null}

          {showTime ? (
            <DateTimePicker
              value={deadline}
              mode="time"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(_, selected) => {
                setShowTime(false);
                if (!selected) return;
                const next = new Date(deadline);
                next.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
                setDeadline(next);
              }}
            />
          ) : null}
        </Card>

        <Button
          label={createTaskMutation.isPending ? "Submitting..." : "Submit task"}
          fullWidth
          onPress={submit}
          loading={createTaskMutation.isPending}
          style={{ backgroundColor: colors.primary, borderColor: colors.primary }}
        />
      </View>
    </Screen>
  );
}

function PickButton({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.subtle,
        backgroundColor: colors.surface,
      }}
    >
      <Ionicons name={icon} size={18} color={colors.text} />
      <Text style={{ color: colors.text, fontWeight: "700" }}>{label}</Text>
    </TouchableOpacity>
  );
}
