/**
 * Edusonex Central Knowledge Graph (RAG) Utility
 * Manages cross-product intelligence and semantic memory.
 */
import { supabase } from "./supabase";

export interface KnowledgeEntry {
    category: 'educational' | 'business' | 'legal' | 'technical';
    source_product: string;
    content: string;
    metadata?: any;
}

/**
 * Stores a new piece of knowledge into the central graph.
 * This can be used by any AI agent to contribute to the global memory.
 */
export async function contributeToKnowledge(entry: KnowledgeEntry) {
    console.log(`Knowledge Contribution: [${entry.source_product}] -> [${entry.category}]`);

    const { data, error } = await supabase.from('ai_knowledge_graph').insert({
        category: entry.category,
        source_product: entry.source_product,
        content_text: entry.content,
        metadata: entry.metadata || {}
    });

    if (error) {
        console.error("Knowledge Graph Error:", error.message);
        return false;
    }
    return true;
}

/**
 * Searches the knowledge graph for relevant context based on category.
 * In a full RAG system, this would use vector embeddings. 
 * For now, it uses semantic text search/filtering.
 */
export async function queryKnowledge(query: string, category?: string) {
    let q = supabase.from('ai_knowledge_graph').select('*');

    if (category) {
        q = q.eq('category', category);
    }

    // Simple text-based search for initial version
    q = q.ilike('content_text', `%${query}%`);

    const { data, error } = await q.limit(5);

    if (error) {
        console.error("Knowledge Query Error:", error.message);
        return [];
    }

    return data;
}

/**
 * AI Control Plane: Unified Knowledge Injector
 * Injects relevant cross-product context into any AI prompt.
 */
export async function injectContext(prompt: string, category: string): Promise<string> {
    const context = await queryKnowledge(prompt.split(' ').slice(0, 5).join(' '), category);

    if (context && context.length > 0) {
        const contextText = context.map(c => `[Context from ${c.source_product}]: ${c.content_text}`).join('\n');
        return `Aşağıdaki ek bilgiler (Knowledge Graph) doğrultusunda cevap ver:\n\n${contextText}\n\nİstek: ${prompt}`;
    }

    return prompt;
}
