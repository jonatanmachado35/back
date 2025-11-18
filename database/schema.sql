-- ZapNutre Database Schema
-- PostgreSQL/Supabase Schema
-- Todas as tabelas e colunas em português

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables (in reverse order of dependencies)
DROP TABLE IF EXISTS anamnese CASCADE;
DROP TABLE IF EXISTS pagamentos CASCADE;
DROP TABLE IF EXISTS registros_pacientes CASCADE;
DROP TABLE IF EXISTS planos CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION atualizar_data_atualizacao()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================================================
-- TABELA USUARIOS
-- ============================================================================
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    numero_whatsapp VARCHAR(50),
    perfis TEXT[] NOT NULL DEFAULT ARRAY['paciente']::TEXT[],
    plano_ativo_id UUID,
    perfil_profissional JSONB,
    perfil_paciente JSONB,
    perfil_paciente_completude INTEGER DEFAULT 0,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for usuarios table
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_perfis ON usuarios USING GIN(perfis);
CREATE INDEX idx_usuarios_plano_ativo_id ON usuarios(plano_ativo_id);

-- Create trigger for atualizado_em
CREATE TRIGGER atualizar_usuarios_data
    BEFORE UPDATE ON usuarios
    FOR EACH ROW
    EXECUTE FUNCTION atualizar_data_atualizacao();

-- Add comments
COMMENT ON TABLE usuarios IS 'Tabela de contas de usuários: pacientes, nutricionistas e administradores';
COMMENT ON COLUMN usuarios.perfis IS 'Perfis do usuário: paciente, nutricionista, admin';
COMMENT ON COLUMN usuarios.perfil_profissional IS 'JSON com bio, crn, areasDeEspecialidade para nutricionistas';
COMMENT ON COLUMN usuarios.perfil_paciente IS 'JSON com dataNascimento, pesoKg, alturaCm, objetivos para pacientes';

-- ============================================================================
-- TABELA PLANOS
-- ============================================================================
CREATE TABLE planos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    publico_alvo VARCHAR(50) NOT NULL CHECK (publico_alvo IN ('b2c', 'profissional', 'admin')),
    preco DECIMAL(10, 2) NOT NULL,
    ciclo_cobranca VARCHAR(50) NOT NULL CHECK (ciclo_cobranca IN ('mensal', 'trimestral', 'anual')),
    beneficios TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    percentual_comissao DECIMAL(5, 2),
    percentual_desconto DECIMAL(5, 2),
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for planos table
CREATE INDEX idx_planos_publico_alvo ON planos(publico_alvo);
CREATE INDEX idx_planos_ciclo_cobranca ON planos(ciclo_cobranca);

-- Create trigger for atualizado_em
CREATE TRIGGER atualizar_planos_data
    BEFORE UPDATE ON planos
    FOR EACH ROW
    EXECUTE FUNCTION atualizar_data_atualizacao();

-- Add comments
COMMENT ON TABLE planos IS 'Planos de assinatura para diferentes tipos de usuários';
COMMENT ON COLUMN planos.publico_alvo IS 'Público alvo: b2c (pacientes), profissional (nutricionistas), admin';
COMMENT ON COLUMN planos.ciclo_cobranca IS 'Frequência de cobrança: mensal, trimestral, anual';

-- ============================================================================
-- TABELA REGISTROS_PACIENTES
-- ============================================================================
CREATE TABLE registros_pacientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    nutricionista_responsavel_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    metricas_saude JSONB NOT NULL DEFAULT '[]'::JSONB,
    registros_refeicoes JSONB NOT NULL DEFAULT '[]'::JSONB,
    lembretes TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    objetivos TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for registros_pacientes table
CREATE INDEX idx_registros_pacientes_usuario_id ON registros_pacientes(usuario_id);
CREATE INDEX idx_registros_pacientes_nutricionista_id ON registros_pacientes(nutricionista_responsavel_id);
CREATE INDEX idx_registros_pacientes_metricas ON registros_pacientes USING GIN(metricas_saude);
CREATE INDEX idx_registros_pacientes_refeicoes ON registros_pacientes USING GIN(registros_refeicoes);

-- Create trigger for atualizado_em
CREATE TRIGGER atualizar_registros_pacientes_data
    BEFORE UPDATE ON registros_pacientes
    FOR EACH ROW
    EXECUTE FUNCTION atualizar_data_atualizacao();

-- Add comments
COMMENT ON TABLE registros_pacientes IS 'Dados de saúde e nutrição dos pacientes';
COMMENT ON COLUMN registros_pacientes.metricas_saude IS 'Array de métricas de saúde com data, pesoKg, percentualGordura, observacoes';
COMMENT ON COLUMN registros_pacientes.registros_refeicoes IS 'Array de registros de refeições com dataHora, itens, calorias, macros';

-- ============================================================================
-- TABELA PAGAMENTOS
-- ============================================================================
CREATE TABLE pagamentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    plano_id UUID NOT NULL REFERENCES planos(id) ON DELETE RESTRICT,
    valor DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('pendente', 'pago', 'falhou', 'reembolsado')),
    provedor VARCHAR(100) NOT NULL,
    referencia_externa VARCHAR(255),
    metadados JSONB,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for pagamentos table
CREATE INDEX idx_pagamentos_usuario_id ON pagamentos(usuario_id);
CREATE INDEX idx_pagamentos_plano_id ON pagamentos(plano_id);
CREATE INDEX idx_pagamentos_status ON pagamentos(status);
CREATE INDEX idx_pagamentos_referencia_externa ON pagamentos(referencia_externa);
CREATE INDEX idx_pagamentos_criado_em ON pagamentos(criado_em DESC);

-- Create trigger for atualizado_em
CREATE TRIGGER atualizar_pagamentos_data
    BEFORE UPDATE ON pagamentos
    FOR EACH ROW
    EXECUTE FUNCTION atualizar_data_atualizacao();

-- Add comments
COMMENT ON TABLE pagamentos IS 'Transações de pagamento de planos de assinatura';
COMMENT ON COLUMN pagamentos.status IS 'Status do pagamento: pendente, pago, falhou, reembolsado';
COMMENT ON COLUMN pagamentos.referencia_externa IS 'ID de referência do provedor de pagamento externo';

-- ============================================================================
-- TABELA ANAMNESE
-- ============================================================================
CREATE TABLE anamnese (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    objetivo TEXT NOT NULL,
    restricoes_alimentares TEXT,
    preferencias TEXT,
    motivacao TEXT,
    respostas JSONB NOT NULL DEFAULT '[]'::JSONB,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for anamnese table
CREATE INDEX idx_anamnese_usuario_id ON anamnese(usuario_id);
CREATE INDEX idx_anamnese_respostas ON anamnese USING GIN(respostas);

-- Create trigger for atualizado_em
CREATE TRIGGER atualizar_anamnese_data
    BEFORE UPDATE ON anamnese
    FOR EACH ROW
    EXECUTE FUNCTION atualizar_data_atualizacao();

-- Add comments
COMMENT ON TABLE anamnese IS 'Questionários de saúde e avaliação nutricional dos pacientes';
COMMENT ON COLUMN anamnese.respostas IS 'Array de pares pergunta-resposta';

-- ============================================================================
-- ADD FOREIGN KEY CONSTRAINT FOR plano_ativo_id
-- ============================================================================
ALTER TABLE usuarios
ADD CONSTRAINT fk_usuarios_plano_ativo_id
FOREIGN KEY (plano_ativo_id) REFERENCES planos(id) ON DELETE SET NULL;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
-- Enable RLS on all tables
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE planos ENABLE ROW LEVEL SECURITY;
ALTER TABLE registros_pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE anamnese ENABLE ROW LEVEL SECURITY;

-- Planos: Leitura pública para usuários autenticados
CREATE POLICY "Planos são visíveis para usuários autenticados"
    ON planos FOR SELECT
    TO authenticated
    USING (true);

-- Planos: Apenas admins podem gerenciar
CREATE POLICY "Planos são gerenciáveis por admins"
    ON planos FOR ALL
    TO authenticated
    USING ('admin' = ANY(
        (SELECT perfis FROM usuarios WHERE id = auth.uid())
    ));

-- Usuários: Podem ver seus próprios dados
CREATE POLICY "Usuários podem ver próprios dados"
    ON usuarios FOR SELECT
    TO authenticated
    USING (id = auth.uid() OR 'admin' = ANY(
        (SELECT perfis FROM usuarios WHERE id = auth.uid())
    ));

-- Usuários: Podem atualizar seus próprios dados
CREATE POLICY "Usuários podem atualizar próprios dados"
    ON usuarios FOR UPDATE
    TO authenticated
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- Registros de pacientes: Visível para dono ou nutricionista responsável
CREATE POLICY "Registros visíveis para dono ou nutricionista"
    ON registros_pacientes FOR SELECT
    TO authenticated
    USING (
        usuario_id = auth.uid()
        OR nutricionista_responsavel_id = auth.uid()
        OR 'admin' = ANY((SELECT perfis FROM usuarios WHERE id = auth.uid()))
    );

-- Registros de pacientes: Atualizável por dono ou nutricionista
CREATE POLICY "Registros atualizáveis por dono ou nutricionista"
    ON registros_pacientes FOR ALL
    TO authenticated
    USING (
        usuario_id = auth.uid()
        OR nutricionista_responsavel_id = auth.uid()
        OR 'admin' = ANY((SELECT perfis FROM usuarios WHERE id = auth.uid()))
    );

-- Pagamentos: Usuários podem ver seus próprios pagamentos
CREATE POLICY "Pagamentos visíveis para dono"
    ON pagamentos FOR SELECT
    TO authenticated
    USING (
        usuario_id = auth.uid()
        OR 'admin' = ANY((SELECT perfis FROM usuarios WHERE id = auth.uid()))
    );

-- Anamnese: Visível para dono, nutricionista responsável ou admin
CREATE POLICY "Anamnese visível para dono ou nutricionista"
    ON anamnese FOR SELECT
    TO authenticated
    USING (
        usuario_id = auth.uid()
        OR 'admin' = ANY((SELECT perfis FROM usuarios WHERE id = auth.uid()))
        OR usuario_id IN (
            SELECT usuario_id FROM registros_pacientes
            WHERE nutricionista_responsavel_id = auth.uid()
        )
    );

-- Anamnese: Gerenciável pelo dono
CREATE POLICY "Anamnese gerenciável pelo dono"
    ON anamnese FOR ALL
    TO authenticated
    USING (usuario_id = auth.uid())
    WITH CHECK (usuario_id = auth.uid());

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Inserir planos padrão
INSERT INTO planos (nome, descricao, publico_alvo, preco, ciclo_cobranca, beneficios) VALUES
    ('Teste Gratuito', 'Recursos básicos para novos usuários', 'b2c', 0.00, 'mensal',
     ARRAY['Registro básico de refeições', 'Consultas limitadas com nutricionista']),
    ('Paciente Premium', 'Recursos completos para pacientes', 'b2c', 29.90, 'mensal',
     ARRAY['Registro ilimitado de refeições', 'Consultas semanais com nutricionista', 'Planos alimentares personalizados', 'Suporte via WhatsApp']),
    ('Profissional', 'Para nutricionistas gerenciando múltiplos pacientes', 'profissional', 99.90, 'mensal',
     ARRAY['Gerenciar até 50 pacientes', 'Dashboard de analytics', 'Acompanhamento de progresso', 'Comissão por indicações']);

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Schema do banco de dados ZapNutre criado com sucesso!';
    RAISE NOTICE 'Tabelas criadas: usuarios, planos, registros_pacientes, pagamentos, anamnese';
    RAISE NOTICE 'Planos padrão foram cadastrados.';
    RAISE NOTICE 'O usuário admin será criado automaticamente quando a API iniciar.';
END $$;
