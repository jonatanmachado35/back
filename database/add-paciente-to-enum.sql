-- Add missing 'paciente' value to tipo_usuario enum
-- Run this in Supabase SQL Editor: https://app.supabase.com

-- Add the paciente value to the tipo_usuario enum
DO $$
BEGIN
    -- Check if the type exists and add the value if it doesn't exist
    IF NOT EXISTS (
        SELECT 1
        FROM pg_enum e
        JOIN pg_type t ON e.enumtypid = t.oid
        WHERE t.typname = 'tipo_usuario' AND e.enumlabel = 'paciente'
    ) THEN
        ALTER TYPE tipo_usuario ADD VALUE 'paciente';
        RAISE NOTICE 'Added "paciente" to tipo_usuario enum';
    ELSE
        RAISE NOTICE '"paciente" already exists in tipo_usuario enum';
    END IF;
END$$;

-- Verify the enum values
SELECT enumlabel as valid_tipo_values
FROM pg_enum
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'tipo_usuario')
ORDER BY enumsortorder;
