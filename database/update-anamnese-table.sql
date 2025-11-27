-- Atualizar tabela anamnese para armazenar todos os dados em JSONB
-- Isso permite flexibilidade para adicionar novos campos sem alterar o schema

-- Drop e recriar a tabela anamnese com a nova estrutura
DROP TABLE IF EXISTS anamnese CASCADE;

CREATE TABLE anamnese (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    dados JSONB NOT NULL,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_anamnese_usuario_id ON anamnese(usuario_id);
CREATE INDEX idx_anamnese_dados ON anamnese USING GIN(dados);

-- Create trigger for atualizado_em
CREATE TRIGGER atualizar_anamnese_data
    BEFORE UPDATE ON anamnese
    FOR EACH ROW
    EXECUTE FUNCTION atualizar_data_atualizacao();

-- Enable RLS
ALTER TABLE anamnese ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anamnese visível para dono ou nutricionista"
    ON anamnese FOR SELECT
    USING (
        usuario_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM usuarios 
            WHERE id = auth.uid() 
            AND 'admin' = ANY(perfis)
        )
        OR usuario_id IN (
            SELECT usuario_id FROM registros_pacientes
            WHERE nutricionista_responsavel_id = auth.uid()
        )
    );

CREATE POLICY "Anamnese gerenciável pelo dono"
    ON anamnese FOR ALL
    USING (usuario_id = auth.uid())
    WITH CHECK (usuario_id = auth.uid());

-- Add comment
COMMENT ON TABLE anamnese IS 'Questionários de anamnese nutricional completos dos pacientes';
COMMENT ON COLUMN anamnese.dados IS 'Dados completos da anamnese incluindo dadosPessoais, estiloVida, habitosAlimentares, historicoSaude e objetivos';