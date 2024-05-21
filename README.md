<!-- ## Esquema Tablas Base de Datos -->

## Tablas de usuario

- id (uuid)
- full_name (text)
- avatar_url (text)

## Crear tablas de usuario

```sql
CREATE TABLE public.users (
   id uuid not null references auth.users on delete cascade,
   full_name text NULL,
   avatar_url text NULL,
   primary key (id)
);
```

## Habilitar Row Level Security

```sql
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
```

## Permitir a los usuarios acceder a sus perfiles

```sql
CREATE POLICY "Permitir a los usuarios acceder a sus perfiles"
  ON public.users
  FOR SELECT
  USING ( auth.uid() = id );
```

## Permitir a los usuarios actualizar a sus perfiles

```sql
CREATE POLICY "Permitir a los usuarios actualizar a sus perfiles"
  ON public.users
  FOR UPDATE
  USING ( auth.uid() = id );
```

## Funciones de Supabase

```sql
CREATE
OR REPLACE FUNCTION public.user_profile() RETURNS TRIGGER AS $$ BEGIN INSERT INTO public.usuario (id, full_name,avatar_url)
VALUES
  (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name'::TEXT,
    NEW.raw_user_meta_data ->> 'avatar_url'::TEXT,
  );
RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Trigger Supabase

```sql
  CREATE TRIGGER
  create_user_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE
    public.user_profile();
```

## Tabla de mensajes en tiempo real

- id (uuid)
- created at (date)
- text (text)
- editable (boolean)
- sender (uuid)
