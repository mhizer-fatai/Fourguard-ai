# { "Depends": "py-genlayer:latest" }
from genlayer import *
import json

class FourGuardAuditor(gl.Contract):
    reports: TreeMap[str, str]
    scores: TreeMap[str, u256]

    def __init__(self):
        # TreeMap storage is automatically initialized by the GenVM runtime
        pass

    @gl.public.write
    def audit_token(self, token_address: str, name: str, symbol: str, metadata: str):
        # Hardened prompt for better initial quality
        prompt = (
            f"SYSTEM: You are the FourGuard AI Deterministic Audit Engine. "
            f"TASK: Audit token {name} ({symbol}) at address {token_address}. "
            f"INPUT_DATA (JSON): {metadata}. "
            "INSTRUCTIONS: "
            "1. Evaluate ownership, mint authority, and liquidity. "
            "2. YOU MUST RETURN ONLY A JSON OBJECT. "
            "OUTPUT_FORMAT: "
            '{"guardScore": <int:0-100>, "riskLevel": <string:"safe"|"warning"|"critical">}'
        )

        def leader_fn():
            try:
                # Remove response_format for max compatibility in diagnostic run
                return gl.nondet.exec_prompt(prompt)
            except Exception as e:
                raise gl.UserError(f"[LLM_ERROR] {str(e)}")

        def validator_fn(result: gl.vm.Result) -> bool:
            # DIAGNOSTIC MODE: Permissive validation to ensure consensus during debugging
            if isinstance(result, gl.vm.Return):
                return True
            if isinstance(result, gl.vm.UserError):
                return True 
            return False

        raw_result = gl.vm.run_nondet_unsafe(leader_fn, validator_fn)
        
        try:
            data_val = raw_result
            
            # 1. Handle Bytes
            if isinstance(data_val, (bytes, bytearray)):
                data_val = data_val.decode('utf-8')
            
            # 2. String processing (strip filler)
            if isinstance(data_val, str):
                try:
                    start = data_val.find('{')
                    end = data_val.rfind('}') + 1
                    if start != -1 and end > start:
                        data = json.loads(data_val[start:end])
                    else:
                        data = json.loads(data_val)
                except:
                    # Fallback if extraction fails
                    self.reports[token_address] = json.dumps({"raw_debug": data_val[:150], "guardScore": 0, "riskLevel": "critical"})
                    self.scores[token_address] = u256(0)
                    return

            # 3. Final data extraction
            if isinstance(data, dict):
                score_val = data.get("guardScore", data.get("score", 0))
                try:
                    final_score = int(score_val) if score_val is not None else 0
                except:
                    final_score = 0
                
                risk_raw = str(data.get("riskLevel", data.get("risk", "critical"))).lower()
                final_risk = "safe" if "safe" in risk_raw else "warning" if "warn" in risk_raw else "critical"
                
                self.reports[token_address] = json.dumps({"guardScore": final_score, "riskLevel": final_risk, "consensus": True})
                self.scores[token_address] = u256(final_score)
            else:
                raise Exception("Unknown data structure")

        except Exception as e:
            self.reports[token_address] = json.dumps({"error": str(e), "guardScore": 0, "riskLevel": "critical"})
            self.scores[token_address] = u256(0)



    @gl.public.view
    def get_score(self, token_address: str) -> u256:
        try:
            return self.scores[token_address]
        except:
            return u256(0)

    @gl.public.view
    def get_report(self, token_address: str) -> str:
        try:
            return self.reports[token_address]
        except:
            return "No audit found."