from src.generation.groq_llm import GroqLLM


QUERY_REWRITE_PROMPT = """
You are a query rewriting component for a conversational RAG system.
Your job is to rewrite the user's latest question into a
standalone search query that can be understood without the
conversation history.
RULES:
1. Use the conversation history only to resolve references
   such as:
   - he / she / they
   - it / this / that
   - the company / the person / the event
   - follow-up questions
2. Preserve the user's original intent.
3. Do not answer the question.
4. Do not add information that is not present in the
   conversation.
5. If the user's question is already standalone, return it
   unchanged.
6. Return ONLY the rewritten standalone query.
   Do not add explanations, quotation marks, or labels.
CONVERSATION HISTORY:{history}
LATEST USER QUESTION:{query}
STANDALONE QUERY:
"""
class QueryRewriter:
    def __init__(self,model_name: str = "openai/gpt-oss-20b",):
        self.llm = GroqLLM(model_name=model_name)

    def rewrite(self,query: str,conversation_history: list[dict] | None = None,) -> str:
        if not conversation_history:
            return query.strip()
        history_text = "\n".join(
            f"{message['role'].upper()}: {message['content']}"
            for message in conversation_history
        )
        prompt = QUERY_REWRITE_PROMPT.format(history=history_text,query=query,)
        rewritten_query = self.llm.generate(prompt,temperature=0.0,)
        return rewritten_query.strip()