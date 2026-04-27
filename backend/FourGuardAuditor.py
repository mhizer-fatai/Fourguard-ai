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
        """
        FourGuard AI Audit Engine — Optimistic Democracy Implementation
        
        How it works:
        1. Leader validator runs an independent AI analysis against the 7 rules
        2. Each validator ALSO runs its own independent AI analysis (not just checking JSON)
        3. Validators compare their verdict with the leader's verdict
        4. If verdicts match → approve (True). If not → reject (False)
        5. Majority vote wins. If no majority → GenLayer rotates to a new leader
        
        This is the Comparative Equivalence Principle — both sides do the work,
        then compare results. GenLayer was designed exactly for this.
        """

        # The audit prompt — shared by leader AND validators
        # Both run this independently with their own LLM instances
        audit_prompt = (
            f"You are a blockchain security auditor. "
            f"Audit this BSC token: {name} ({symbol}) at address {token_address}. "
            f"Token data: {metadata}. "
            "Evaluate against these 7 security rules: "
            "Rule 1: Has social presence (Website, Twitter, or Telegram). "
            "Rule 2: Liquidity is above $10,000. "
            "Rule 3: Contract ownership is renounced. "
            "Rule 4: Mint authority is disabled. "
            "Rule 5: Top 10 holders own less than 50% of supply. "
            "Rule 6: Dev wallet holds less than 10% of supply. "
            "Rule 7: Market cap is realistic relative to liquidity. "
            "COUNT how many rules pass. Then classify: "
            "- 5-7 rules pass = safe (score 85-95). "
            "- 3-4 rules pass = warning (score 50-70). "
            "- 0-2 rules pass = critical (score 10-30). "
            "Return ONLY a JSON object with these exact keys: "
            '{"guardScore": <integer>, "riskLevel": "<safe|warning|critical>", '
            '"rulesPassed": <integer>, "rulesTotal": 7}'
        )

        def leader_fn():
            """Leader performs the full AI audit analysis"""
            try:
                return gl.nondet.exec_prompt(audit_prompt, response_format="json")
            except Exception as e:
                raise gl.vm.UserError(f"[LEADER_LLM_ERROR] {str(e)}")

        def validator_fn(leaders_res) -> bool:
            """
            Validator performs its OWN independent AI audit, then compares
            with the leader's verdict. This is the core of Optimistic Democracy —
            both parties independently arrive at a conclusion.
            
            Agreement criteria: Both must reach the SAME riskLevel category.
            We don't require exact score match (LLMs are non-deterministic),
            but the categorical verdict (safe/warning/critical) must match.
            """
            # Step 1: If leader errored, try running ourselves
            if not isinstance(leaders_res, gl.vm.Return):
                try:
                    # Leader failed — can we succeed? If yes, disagree (force new leader)
                    leader_fn()
                    return False  # We succeeded but leader failed — disagree
                except:
                    return True   # Both failed the same way — agree on the error

            # Step 2: Parse leader's result
            try:
                leader_data = leaders_res.calldata
                if isinstance(leader_data, (bytes, bytearray)):
                    leader_data = leader_data.decode('utf-8')
                if isinstance(leader_data, str):
                    start = leader_data.find('{')
                    end = leader_data.rfind('}') + 1
                    leader_parsed = json.loads(leader_data[start:end])
                elif isinstance(leader_data, dict):
                    leader_parsed = leader_data
                else:
                    return False  # Can't parse leader's result

                leader_risk = str(leader_parsed.get("riskLevel", "")).lower().strip()
                leader_score = leader_parsed.get("guardScore", 0)

                # Validate leader returned a valid category
                if leader_risk not in ("safe", "warning", "critical"):
                    return False  # Leader returned garbage — reject

                # Validate score is a reasonable number
                try:
                    leader_score = int(leader_score)
                    if leader_score < 0 or leader_score > 100:
                        return False
                except:
                    return False

            except:
                return False  # Leader's output is unparseable — reject

            # Step 3: Run our OWN independent AI analysis
            try:
                my_raw = leader_fn()

                # Parse our own result
                if isinstance(my_raw, (bytes, bytearray)):
                    my_raw = my_raw.decode('utf-8')
                if isinstance(my_raw, str):
                    start = my_raw.find('{')
                    end = my_raw.rfind('}') + 1
                    my_parsed = json.loads(my_raw[start:end])
                elif isinstance(my_raw, dict):
                    my_parsed = my_raw
                else:
                    return False

                my_risk = str(my_parsed.get("riskLevel", "")).lower().strip()

                if my_risk not in ("safe", "warning", "critical"):
                    return False  # Our own LLM returned garbage — can't judge

            except:
                return False  # Our LLM errored — can't validate, reject

            # Step 4: THE VOTE — Compare categorical verdicts
            # Both the leader and validator independently analyzed the same token.
            # If they reached the same riskLevel category, consensus is reached.
            # This tolerates score differences (85 vs 90) but catches disagreements
            # (safe vs critical = clearly something is wrong, force re-audit).
            return my_risk == leader_risk

        # Execute with Optimistic Democracy consensus
        raw_result = gl.vm.run_nondet_unsafe(leader_fn, validator_fn)

        # --- Post-consensus: Store the agreed-upon result ---
        # At this point, the majority of validators agreed with the leader.
        # We now extract and store the consensus result deterministically.
        try:
            data_val = raw_result

            # Handle bytes
            if isinstance(data_val, (bytes, bytearray)):
                data_val = data_val.decode('utf-8')

            # Parse JSON from string
            if isinstance(data_val, str):
                start = data_val.find('{')
                end = data_val.rfind('}') + 1
                if start != -1 and end > start:
                    data = json.loads(data_val[start:end])
                else:
                    data = json.loads(data_val)
            elif isinstance(data_val, dict):
                data = data_val
            else:
                raise Exception("Unexpected result type from consensus")

            # Extract and normalize the consensus verdict
            score_val = data.get("guardScore", data.get("score", 0))
            try:
                final_score = int(score_val) if score_val is not None else 0
                final_score = max(0, min(100, final_score))  # Clamp 0-100
            except:
                final_score = 0

            risk_raw = str(data.get("riskLevel", data.get("risk", "critical"))).lower()
            final_risk = "safe" if "safe" in risk_raw else "warning" if "warn" in risk_raw else "critical"

            rules_passed = data.get("rulesPassed", 0)
            try:
                rules_passed = int(rules_passed)
            except:
                rules_passed = 0

            # Store the consensus-backed audit report
            self.reports[token_address] = json.dumps({
                "guardScore": final_score,
                "riskLevel": final_risk,
                "rulesPassed": rules_passed,
                "rulesTotal": 7,
                "consensus": True,
                "method": "optimistic_democracy"
            })
            self.scores[token_address] = u256(final_score)

        except Exception as e:
            # Consensus passed but we failed to parse — store error with safe defaults
            self.reports[token_address] = json.dumps({
                "error": str(e),
                "guardScore": 0,
                "riskLevel": "critical",
                "consensus": False
            })
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