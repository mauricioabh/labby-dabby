import { useSignUp, useSSO } from '@clerk/clerk-expo';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  ActivityIndicator,
} from 'react-native';

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { startSSOFlow } = useSSO();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [pendingVerify, setPendingVerify] = useState(false);
  const [error, setError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  const onSignUp = useCallback(async () => {
    if (!isLoaded) return;
    setError('');
    try {
      await signUp.create({ emailAddress: email, password });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerify(true);
    } catch (e: unknown) {
      const msg =
        e && typeof e === 'object' && 'errors' in e
          ? (e as { errors: { message?: string }[] }).errors?.[0]?.message
          : e instanceof Error
            ? e.message
            : 'Error al registrarse';
      setError(String(msg));
    }
  }, [isLoaded, signUp, email, password]);

  const onVerify = useCallback(async () => {
    if (!isLoaded) return;
    setError('');
    try {
      const attempt = await signUp.attemptEmailAddressVerification({ code });
      if (attempt.status === 'complete') {
        await setActive({
          session: attempt.createdSessionId,
          navigate: async ({ session }) => {
            if (session?.currentTask) return;
            router.replace('/');
          },
        });
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Código inválido';
      setError(String(msg));
    }
  }, [isLoaded, signUp, setActive, router, code]);

  const onGoogleSignUp = useCallback(async () => {
    if (!isLoaded) return;
    setGoogleLoading(true);
    setError('');
    try {
      const { createdSessionId, setActive: setActiveSession } = await startSSOFlow({
        strategy: 'oauth_google',
      });
      if (createdSessionId && setActiveSession) {
        await setActiveSession({ session: createdSessionId });
        router.replace('/');
      }
    } catch (e: unknown) {
      const err = e as { errors?: { message?: string }[] };
      const msg =
        err?.errors?.[0]?.message ??
        (e instanceof Error ? e.message : 'Error con Google');
      setError(String(msg));
    } finally {
      setGoogleLoading(false);
    }
  }, [isLoaded, startSSOFlow, router]);

  if (pendingVerify) {
    return (
      <KeyboardAvoidingView
        className="flex-1 bg-background"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View className="flex-1 p-lg pt-3xl">
          <Text className="mb-sm text-xl font-semibold text-foreground">
            Verificar email
          </Text>
          <Text className="mb-xl text-sm text-muted-foreground">
            Te enviamos un código a {email}
          </Text>
          <TextInput
            className="mb-md rounded-xl border border-border bg-card px-lg py-md text-base text-foreground"
            value={code}
            placeholder="Código"
            placeholderTextColor="#64748b"
            onChangeText={setCode}
            keyboardType="number-pad"
            autoCapitalize="none"
          />
          {error ? (
            <Text className="mb-md text-sm text-destructive">{error}</Text>
          ) : null}
          <TouchableOpacity
            className="rounded-xl bg-primary py-md"
            onPress={onVerify}
          >
            <Text className="text-center font-semibold text-primary-foreground">
              Verificar
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 24, paddingTop: 60, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator
      >
        <Text className="mb-md text-xl font-semibold text-foreground">
          Crear cuenta
        </Text>
        <TouchableOpacity
          className="mb-md flex-row items-center justify-center gap-2 rounded-xl border border-border bg-card py-md"
          onPress={onGoogleSignUp}
          disabled={googleLoading}
        >
          {googleLoading ? (
            <ActivityIndicator size="small" color="#64748b" />
          ) : (
            <>
              <MaterialCommunityIcons name="google" size={22} color="#4285F4" />
              <Text className="font-medium text-foreground">
                Continuar con Google
              </Text>
            </>
          )}
        </TouchableOpacity>
        <View className="mb-md flex-row items-center gap-2">
          <View className="h-px flex-1 bg-border" />
          <Text className="text-sm text-muted-foreground">o con email</Text>
          <View className="h-px flex-1 bg-border" />
        </View>
        <TextInput
          className="mb-md rounded-xl border border-border bg-card px-lg py-md text-base text-foreground"
          value={email}
          placeholder="Email"
          placeholderTextColor="#64748b"
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          className="mb-md rounded-xl border border-border bg-card px-lg py-md text-base text-foreground"
          value={password}
          placeholder="Contraseña"
          placeholderTextColor="#64748b"
          secureTextEntry
          onChangeText={setPassword}
        />
        {error ? (
          <Text className="mb-md text-sm text-destructive">{error}</Text>
        ) : null}
        <TouchableOpacity
          className={`rounded-xl bg-primary py-md ${!email || !password ? 'opacity-50' : ''}`}
          onPress={onSignUp}
          disabled={!email || !password}
        >
          <Text className="text-center font-semibold text-primary-foreground">
            Registrarme
          </Text>
        </TouchableOpacity>
        <View className="mt-xl flex-row items-center">
          <Text className="text-muted-foreground">¿Ya tienes cuenta? </Text>
          <Link href="/sign-in" asChild>
            <TouchableOpacity>
              <Text className="font-medium text-primary">Iniciar sesión</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
