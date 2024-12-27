from backend.models import Host, Profile, ScanEvent
from backend.service.nmap_parser import NMapParserService


nmap_json = {
    "nmaprun": {
        "@scanner": "nmap",
        "@args": "/opt/homebrew/bin/nmap -sn --unprivileged -T4 -oX - 192.168.1.0-100",
        "@start": "1735252720",
        "@startstr": "Thu Dec 26 17:38:40 2024",
        "@version": "7.95",
        "@xmloutputversion": "1.05",
        "verbose": {"@level": "0"},
        "debugging": {"@level": "0"},
        "host": [
            {
                "status": {"@state": "up", "@reason": "syn-ack", "@reason_ttl": "0"},
                "address": {"@addr": "192.168.1.1", "@addrtype": "ipv4"},
                "hostnames": {"hostname": {"@name": "pfsense.home", "@type": "PTR"}},
                "times": {"@srtt": "648", "@rttvar": "5000", "@to": "100000"},
            },
            {
                "status": {"@state": "up", "@reason": "conn-refused", "@reason_ttl": "0"},
                "address": {"@addr": "192.168.1.24", "@addrtype": "ipv4"},
                "hostnames": {"hostname": {"@name": "Minerva.home", "@type": "PTR"}},
                "times": {"@srtt": "206", "@rttvar": "5000", "@to": "100000"},
            },
            {
                "status": {"@state": "up", "@reason": "conn-refused", "@reason_ttl": "0"},
                "address": {"@addr": "192.168.1.73", "@addrtype": "ipv4"},
                "hostnames": {"hostname": {"@name": "iPhone.home", "@type": "PTR"}},
                "times": {"@srtt": "58556", "@rttvar": "58556", "@to": "292780"},
            },
            {
                "status": {"@state": "up", "@reason": "conn-refused", "@reason_ttl": "0"},
                "address": {"@addr": "192.168.1.75", "@addrtype": "ipv4"},
                "hostnames": {"hostname": {"@name": "MacBookPro.home", "@type": "PTR"}},
                "times": {"@srtt": "188", "@rttvar": "5000", "@to": "100000"},
            },
        ],
        "runstats": {
            "finished": {
                "@time": "1735252727",
                "@timestr": "Thu Dec 26 17:38:47 2024",
                "@summary": "Nmap done at Thu Dec 26 17:38:47 2024; 101 IP addresses (4 hosts up) scanned in 6.77 seconds",
                "@elapsed": "6.77",
                "@exit": "success",
            },
            "hosts": {"@up": "4", "@down": "97", "@total": "101"},
        },
    }
}


def test_nmap_parser(mocker):

    mock_parser_service = mocker.patch("backend.service.nmap_parser.NMapParserService")
    mock_parser_service.scan_results = nmap_json
    mock_parser_service.profile = Profile(profile_id="1234", profile_name="Test Profile")

    mock_parser_service.build_scan_event_from_results.return_value = {
        "profile_id": "1234",
        "profile_name": "Test Profile",
        "profile_description": None,
        "ip_range": "",
    }

    nmap_parser_service = NMapParserService(
        scan_results=mock_parser_service.scan_results, profile=mock_parser_service.profile
    )
    response = nmap_parser_service.build_scan_event_from_results()

    assert isinstance(response, ScanEvent)

    assert response.profile_id == "1234"
    assert len(response.hosts) == 4

    assert isinstance(response.hosts[0], Host)
